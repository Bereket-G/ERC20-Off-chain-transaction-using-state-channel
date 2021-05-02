const minimist =  require('minimist');
const Web3 =  require('web3');
const path = require('path');

const argv = minimist(process.argv.slice(2));
const contractAddress = argv.s || '0x086e588CeEE4cA694ce4A0631163b4f06b53B2D0';
const web3Provider = argv.w || 'http://localhost:9545';
const PORT = '8080';
const storageLocation = argv.f || path.join(__dirname, './data/storage');
const ERC20Contract =  require('../build/contracts/ERC20');
const Server = require('./server/server');


(async () => {
    const JSONStorage = require('node-localstorage').JSONStorage;
    const storage = new JSONStorage(storageLocation);

    // WEB3
    const web3 = new Web3();
    web3.setProvider(new Web3.providers.HttpProvider(web3Provider));
    const accounts = await web3.eth.getAccounts();

    web3.eth.defaultAccount = accounts[0];

    const ERC20TokenContract = new web3.eth.Contract(ERC20Contract.abi, contractAddress);

    const server = Server({
        contract : ERC20TokenContract,
        storage,
        web3
    });


    server.listen(PORT, () => console.log("Server listening on port", PORT));

})();

