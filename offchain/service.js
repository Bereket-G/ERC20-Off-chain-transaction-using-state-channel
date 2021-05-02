const {_signReceipt, _isValidSignature, _generateId} = require("./utils/utils");
const t = require('tcomb');

const Receipt = require("./main/receipt");
const {RECEIPT_EVENTS, RECEIPT_STATES} = require("./constants/constants");


module.exports = class Service {
    constructor({
                    contract,
                    storage,
                    web3
                }) {
        this.contract = contract;
        this.storage = storage;
        this.web3 = web3;
    }

    // Test CLI
    static async testCli() {
        return 'hello'
    }

    // Test CLI
    async getBalance(params) {
        return await this.contract.methods.balanceOf(params.address).call();
        // return await this.web3.eth.getBalance(params.address);
    }

    // Test CLI
    async onChainTransfer(params) {
        return await this.contract.methods.transfer(
            params.to_address, params.amount).send({from: params.from_address});
    }

    // View receipts
    async allReceipts() {
        return this.storage.getItem('receipts') || {};
    }

    async getReceipt(params) {
        return this.getReceiptById(params.receiptId);
    }

    // Propose a new receipt
    async initiateReceipt(params) {
        const from_address = params.from_address;
        const to_address = params.to_address;

        const receiptId = _generateId();

        let newReceipt = new Receipt({from_address, to_address, amount: params.amount, receiptId});
        this.saveReceipt(newReceipt);

        return newReceipt;
    }

    // Update amount of a receipt
    async updateReceipt(params) {
        const receipt = this.getReceiptById(params.receiptId);
        let receiptStateM = new Receipt({...receipt});

        console.log("---", receiptStateM.state, RECEIPT_STATES.RECEIPT_COMMITTING);

        receiptStateM[RECEIPT_EVENTS.UPDATE_RECEIPT](params);
        this.saveReceipt(receiptStateM);
        return receiptStateM;
    }

    // Update amount of a receipt
    async signReceipt(params) {
        const receipt = this.getReceiptById(params.receiptId);
        let receiptStateM = new Receipt({...receipt});

        let party = "";
        if (params.address === receiptStateM.from_address) party = "from";
        if (params.address === receiptStateM.to_address) party = "to";


        console.log(party, typeof params.address, typeof receiptStateM.from_address, receiptStateM.to_address);

        let signature = await _signReceipt(receiptStateM.from_address, receiptStateM.to_address, receiptStateM.amount,
            receiptStateM.receiptId, this.web3, party);

        console.log("signature ", signature);

        receiptStateM[RECEIPT_EVENTS.SIGN_RECEIPT]({party, signature});
        this.saveReceipt(receiptStateM);

        // checking if both parties have signed the latest receipt
        const readyToCommit = await Service.checkReceiptForCommit(receiptStateM);
        if (readyToCommit) {
            receiptStateM[RECEIPT_EVENTS.COMMIT_RECEIPT]();
            this.saveReceipt(receiptStateM);
            this.commitReceiptTransaction(receiptStateM);
        }

        return receiptStateM;
    }

    async commitReceiptTransaction(receipt) {
        let result = await this.contract.methods.commitReceiptTransaction(receipt.from_address, receipt.to_address, receipt.amount,
            receipt.receiptId, receipt.sender_signature, receipt.receipt_signature).send({from: receipt.from_address});
        if (result.transactionHash) {
            receipt[RECEIPT_EVENTS.RECEIPT_COMMITTED]();
        } else {
            receipt[RECEIPT_EVENTS.RECEIPT_COMMIT_FAILED]();
        }
    }


    // SaveReceipt to local storage
    saveReceipt(receipt) {
        let receipts = this.storage.getItem('receipts') || {};
        receipts[receipt.receiptId] = receipt;
        this.storage.setItem('receipts', receipts);
    }

    // getReceipt from local storage
    getReceiptById(receiptId) {
        console.log("getting by ", receiptId);
        let receipts = this.storage.getItem('receipts') || {};
        return receipts[receiptId];
    }


    // This checks that if both parties signature is valid
    async checkReceiptForCommit(receipt) {

        if (receipt.sender_signature == null || receipt.receipt_signature == null) {
            return;
        }
        try {
            let doesSenderSigned = _isValidSignature(receipt.from_address, receipt.to_address, receipt.amount,
                receipt.receiptId, receipt.sender_signature, receipt.from_address);
            let doesReceiverSigned = _isValidSignature(receipt.from_address, receipt.to_address, receipt.amount,
                receipt.receiptId, receipt.receipt_signature, receipt.to_address);

            return doesSenderSigned && doesReceiverSigned;

        } catch (e) {
            console.log("Error while validating parties signature");
        }
        return false;

    }


};
