const express = require( 'express');
const bodyParser =  require('body-parser');
const Service = require('../service.js');

module.exports = function Server(globals) {
    let app = express();
    app.use(bodyParser.json());

    const logic = new Service(globals);

    function handlerFactory(method) {
        return function (req, res) {
            console.log('\n' + 'log API:', method, req.body);
            // console.log("Logic", logic);
            logic[method](req.body)
                .then(result => {
                    res.send(result)
                })
                .catch(error => {
                    console.log(error);
                    res.status(500).send({error: error.message})
                })
        }
    }

    app.post('/test_cli', handlerFactory('testCli'));
    app.post('/get_balance', handlerFactory('getBalance'));
    app.post('/on_chain_transfer', handlerFactory('onChainTransfer'));

    app.get('/all', handlerFactory('allReceipts'));
    app.post('/initiate_receipt', handlerFactory('initiateReceipt'));
    app.post('/get_receipt', handlerFactory('getReceipt'));

    app.post('/update_receipt', handlerFactory('updateReceipt'));
    app.post('/sign_receipt', handlerFactory('signReceipt'));

    return app
}
