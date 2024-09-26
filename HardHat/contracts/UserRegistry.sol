// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract UserRegistry {
   struct userInfo {
        string userName;
        uint userAge;
        uint userBalance;
   }
    
   mapping (address => userInfo) registry;

   function setInfo(string memory name, uint age) public {
     require(bytes(registry[msg.sender].userName).length == 0, "User already exists" );
        registry[msg.sender].userName = name;
        registry[msg.sender].userAge = age;

   }

   function updateInfo(string memory name, uint age) public {
        registry[msg.sender].userName = name;
        registry[msg.sender].userAge = age;
   }

   function checkBalance () public view returns (uint) {
         uint balance = registry[msg.sender].userBalance;
         return balance;

   }

   function pay() public payable {
    registry[msg.sender].userBalance += msg.value;
   }

   function checkInfo() public view  returns(string memory, uint,uint) {
     userInfo memory user = registry[msg.sender];
     return (user.userName, user.userAge, user.userBalance);
   }
   
}