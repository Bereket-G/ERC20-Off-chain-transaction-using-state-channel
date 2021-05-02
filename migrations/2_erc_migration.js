const Migrations = artifacts.require("ERC20");

const tokenName = "ERCTOKEN";
const tokenSymbol = "ERC";
const tokenDecimals = 8;
const tokenTotalSupply = 10000000000;

module.exports = function (deployer) {
  deployer.deploy(Migrations, tokenName, tokenSymbol, tokenDecimals, tokenTotalSupply);
};
