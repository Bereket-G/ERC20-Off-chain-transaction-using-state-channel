# ERC20 Offchain transaction using state channel

This is a standard ERC-20 token with support to settle receipt transaction between two parties offchain. 
Both parties can change the amount of the receipt multiple times. It uses state channel technique and finally commits to the chain when signed by both parties. 

This is an example in solidity language of an ERC-20 standard Ethereum Token, mintable and burnable, with owner access permissions and module pausable.


## State diagram

![A test image](state_diagram.jpg)



## Requeriments to run this repository

- [Node.js](https://nodejs.org/download/release/latest-v10.x/): `>=10.0.0`
- [Truffle](https://www.trufflesuite.com/truffle): `v5.1.9`

