const PrivateKeyProvider = require('@truffle/hdwallet-provider');

require('dotenv').config();

const privateKeys = [
    "c7a82f8d10af158c3d9bafc85753b6c63efa11ea329eaa7afe8e810b3ada50fe",
    "09c8d26bad8c1bba3a27cb4447f6d1a0a41d87c73c22e5125f73e63829de4c81",
    "2fc08175909c2e0f242cc45a0943b5c154aab588d231905e87cb04bd3cda7c7e",
    "d81094d62c2cf18d0b9dccd4caf6dfa8e0e88c62856fa2bec10aebd79f34e9f8",
    "a1b09d59cfb4ed8ddbf55860a668bde40df6a86195ec85cb90f48c06ee373715",
    "9c8b11d08da37d2554969748d16cde4cd10580df48b8727c925c43906f01ccd1",
    "0902b4b551f67782b936885d2dd8dfe9524eeb7de698eb9708772da0a7d6ddbb",
    "b1c2d45617531f88f043db0f060109578a5c6ec2439f6d6d15a9dbe9af63910f",
    "2b7c3758521ee85ccb9ad429529b710814d691db3950ceebf2763b5ad9350ea8",
    "6108bb662485507bb8b3677da73d6d8ddfbfc29d42e302ec72d2eead66cc0a99"
]

module.exports = {
    networks: {
        besu: {
            gas: 4700000,
            gasPrice: 0,
            provider: () => new PrivateKeyProvider(privateKeys, 'http://127.0.0.1:8545', 0, 10),
            network_id: '*',

        },
        development: {
            host: '127.0.0.1',
            port: 9545,
            network_id: '*'
        },
        ropsten: {
            provider: () => new PrivateKeyProvider(process.env.MNENOMIC, "https://ropsten.infura.io/v3/" + process.env.INFURA_API_KEY),
            network_id: 3,
            gas: 3000000,
            gasPrice: 10000000000
        },
        kovan: {
            provider: () => new PrivateKeyProvider(process.env.MNENOMIC, "https://kovan.infura.io/v3/" + process.env.INFURA_API_KEY),
            network_id: 42,
            gas: 3000000,
            gasPrice: 10000000000
        },
        rinkeby: {
            provider: () => new PrivateKeyProvider(process.env.MNENOMIC, "https://rinkeby.infura.io/v3/" + process.env.INFURA_API_KEY),
            network_id: 4,
            gas: 4000000,
            gasPrice: 10000000000
        },
        main: {
            provider: () => new PrivateKeyProvider(process.env.MNENOMIC, "https://mainnet.infura.io/v3/" + process.env.INFURA_API_KEY),
            network_id: 1,
            gas: 3000000,
            gasPrice: 10000000000
        }
    },
    compilers: {
        solc: {
            version: "0.6.8",
            docker: false,
            settings: {
                optimizer: {
                    enabled: true,
                }
            }
        }
    }
}
