const {RECEIPT_STATES, RECEIPT_EVENTS} = require('../constants/constants');


module.exports = class Receipt {
    constructor({
                    receiptId, from_address, to_address, amount, sender_signature = null, receipt_signature = null,
                    lastUpdated = new Date().getTime(), state = RECEIPT_STATES.RECEIPT_INITIALIZED
                }) {
        this.receiptId = receiptId;
        this.from_address = from_address;
        this.to_address = to_address;
        this.amount = amount;
        this.sender_signature = sender_signature;
        this.receipt_signature = receipt_signature;
        this.lastUpdated = lastUpdated; // not used on current implementation
        this.state = state;
    }

    [RECEIPT_EVENTS.UPDATE_RECEIPT](params) {

        // No update on receipt which is being committed or already on chain.
        if ([RECEIPT_STATES.RECEIPT_COMMITTING, RECEIPT_STATES.RECEIPT_ON_CHAIN].includes(this.state))
            throw new Error("Cannot update. Receipt already being commit");

        this.amount = params.amount;
        this.to_address = params.to_address;
        this.clearSignatures();
        this.state = RECEIPT_STATES.RECEIPT_UPDATED;
        this.lastUpdated = new Date().getTime();
    }

    [RECEIPT_EVENTS.SIGN_RECEIPT](params) {
        switch (params.party) {
            case "from":
                this.sender_signature = params.signature;
                break;
            case "to":
                this.receipt_signature = params.signature;
                break;
            default:
                throw new Error("Unknown party");
        }
        this.state = RECEIPT_STATES.RECEIPT_SIGNED_BY_ONE_PARTY;
    }

    [RECEIPT_EVENTS.COMMIT_RECEIPT]() {
        this.state = RECEIPT_STATES.RECEIPT_COMMITTING;
    }

    [RECEIPT_EVENTS.RECEIPT_COMMIT_FAILED]() {
        this.state = RECEIPT_STATES.RECEIPT_FAILED_TO_COMMIT;
    }

    [RECEIPT_EVENTS.RECEIPT_COMMITTED]() {
        this.state = RECEIPT_STATES.RECEIPT_ON_CHAIN;
    }

    // should be private
    clearSignatures() {
        this.receipt_signature = null;
        this.sender_signature = null;
    }
};
