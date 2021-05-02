const abi = require('ethereumjs-abi');
const ethereumjs = require('ethereumjs-util');

async function _signReceipt(sender, recipient, amount, nonce, web3Instance, party) {
    const hash = hashReceipt(sender, recipient, amount, nonce);

    console.log("the hash when signing", hash, party, sender);
    switch (party) {
        case "from":
            return await web3Instance.eth.sign(hash, sender);
        case "to":
            return await web3Instance.eth.sign(hash, recipient);
        default:
            throw new Error("Unknown party trying to sign");
    }
}

function _recoverSigner(message, signature) {
    const split = ethereumjs.fromRpcSig(signature);
    const publicKey = ethereumjs.ecrecover(ethereumjs.toBuffer(message), split.v, split.r, split.s);
    return ethereumjs.pubToAddress(publicKey).toString("hex");
}

function hashReceipt(sender, recipient, amount, nonce, contractAddress) {
    return "0x" + abi.soliditySHA3(
        ["address", "address", "uint256", "uint256"],
        [sender, recipient, amount, nonce]
    ).toString("hex");
}

function prefixed(hash) {
    return abi.soliditySHA3(
        ["string", "bytes32"],
        ["\x19Ethereum Signed Message:\n32", hash]
    );
}

function _isValidSignature(sender, recipient, amount, nonce, signature, expectedSigner) {
    const hash = hashReceipt(sender, recipient, amount, nonce);
    const message = prefixed(hash);
    const signer = _recoverSigner(message, signature);
    return signer.toLowerCase() ===
        ethereumjs.stripHexPrefix(expectedSigner).toLowerCase();
}

// generate Id for receipt Id / also used as nonce
function _generateId (){
    let a = Math.floor(100000 + Math.random() * 900000)
    a = a.toString().substring(0, 4);
    return parseInt(a);
}

module.exports = { _signReceipt, _isValidSignature, _generateId };
