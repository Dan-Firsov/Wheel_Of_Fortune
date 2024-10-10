// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface IWheelOfFortune {

    

    function deposit() external payable;

    function withdraw(uint256 amount)  external;

    function spinWheel() external returns (address winner);

    function placeBet(uint256 amount) external;

    function getParcticipants() external view returns (address[] memory);

    function getTotalPot() external view returns (uint256);

    function getBalance() external view returns (uint256);

}
