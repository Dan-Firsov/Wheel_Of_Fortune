// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import {IWheelOfFortune} from "./IWheelOfFortune.sol";

contract WheelOfFortune is IWheelOfFortune{

    address  owner;

    mapping (address => uint256) balance;
    

    constructor() {
        owner = msg.sender;
    }

    function deposit() external payable{
        require(msg.value > 0, "Must send ETH");
        balance[msg.sender] += msg.value;
    }

    function withdraw(uint256 amount)  external {
        require(balance[msg.sender] >= amount, "Insufficient funds on balance");
        balance[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);


    }

    function spinWheel() external returns (address winner) {

    }

    function placeBet(uint256 amount) external {

    }

    function getPracticipants() external view returns (address[] memory) {

    }

    function getTotalPot() external view returns (uint256) {

    }

    function getBalance() external view returns (uint256) {
        return balance[msg.sender];

    }

}