//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.6.8;

interface IERC20 {
    function balanceOf(address who) external view returns (uint256);

    function transfer(address to, uint256 value) external returns (bool);

    function allowance(address owner, address spender) external view returns (uint256);

    function transferFrom(address from, address to, uint256 value) external returns (bool);

    function approve(address spender, uint256 value) external returns (bool);

    function commitReceiptTransaction(address _from, address _to, uint256 amount, uint256 nonce, bytes calldata _sender_signature, bytes calldata  _recipient_signature) payable external;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}
