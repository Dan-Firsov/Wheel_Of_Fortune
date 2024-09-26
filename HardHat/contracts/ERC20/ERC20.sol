// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import {IERC20} from "./IERC20.sol";
import {IERC20Metadata} from "./IERC20Metadata.sol";

 abstract contract ERC20 is IERC20, IERC20Metadata {

    mapping (address account => uint256) private _balance;

    mapping (address owner => mapping(address spender => uint256)) private _allowances;

    uint256 private _totalSupply;

    string private _name;
    string private _symbol;

    constructor(string memory name_, string memory symbol_ ) {
        _name = name_;
        _symbol = symbol_;
    }

    function name() public view virtual returns (string memory){
        return _name;
    }

    function symbol() public view virtual  returns (string memory) {
        return _symbol;
    }

    function decimals() public view virtual  returns (uint8) {
        return 18;
    }

    function totalSupply() public view virtual  returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address account) public view virtual  returns (uint256) {
        return _balance[account];
    }
    function allowance(address owner, address spender) public view virtual  returns (uint256) {
        return _allowances[owner][spender];
    }
    
    function transfer(address to, uint256 value) public virtual  returns (bool) {
        address owner = msg.sender;
        _transfer(owner,to,value);
        return true;
    }

    function approve(address spender, uint256 value) public virtual  returns (bool) {
        address owner = msg.sender;
        _approve(owner,spender,value);
        return true;
    }

    function transferFrom(address from, address to, uint256 value) public virtual  returns (bool) {
        address spender = msg.sender;
        _spenderAllowance(from,spender,value);
        _transfer(from,to,value);
        return true;
    }

    function _transfer(address from, address to, uint256 value) internal {
        if(from == address(0)){
            revert(); //Не валидный адрес отправителя
        }
        if(to == address(0)){
            revert(); //Не валидный адрес получателя
        }
        _update(from,to,value);
    }

    function _update(address from, address to, uint256 value) internal virtual {
        if(from == address(0)){
            _totalSupply += value; //Mint
        }
        else {
            uint256 fromBalance = _balance[from];
            if(fromBalance < value){
                revert(); // Не достаточный баланс отправителя
            }
            else {
                unchecked{
                    _balance[from] = fromBalance - value;
                }
            }
        }

        if(to == address(0)){
            unchecked {
                _totalSupply -= value; //Burn
            }
        } else{
            unchecked{
                _balance[to] += value;
            }

        }

        emit Transfer(from,to,value);
        
    }

    function _mint(address account, uint256 value)  internal {
        if(account == address(0)){
            revert(); // Не валидный адрес для минтинга
        }
        _update(address(0),account,value);
    }

    function _burn(address account, uint256 value)  internal {
        if(account == address(0)){
            revert(); // Не валидный адрес для бёрна
        }
        _update(account,address(0),value);
    }

    function _approve (address owner, address spender, uint256 value) internal {
        _approve(owner,spender,value,true);
    }

    function _approve (address owner, address spender, uint value, bool emitEvent) internal {
        if(owner == address(0)){
            revert(); // Не валидный адрес
        }
        if(spender == address(0)){
            revert(); // Не валидный адрес
        }
        _allowances[owner][spender] = value;
        if(emitEvent){
            emit Approval(owner,spender,value);
        }      
    }

    function _spenderAllowance(address owner, address spender, uint256 value) internal {
        uint256 currentAllowance = allowance(owner,spender);
        if(currentAllowance != type(uint256).max){
            if(currentAllowance < value){
                revert(); //Не доступная сумма для перевода
            }
            unchecked{
                _approve(owner,spender, currentAllowance - value,false);
            }
        }

    }
}