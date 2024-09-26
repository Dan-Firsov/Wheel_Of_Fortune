// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import {IERC721} from "./IERC721.sol";
import {IERC721Metadata} from "./IERC721Metadata.sol";
import "./IERC721Receiver.sol";
import {Strings} from "../Library/Strings.sol";

contract ERC721 is IERC721, IERC721Metadata {
    using Strings for uint256;
    string public _name;
    string public _symbol;
    mapping (address => uint) _balances;
    mapping (uint256 => address) _owners;
    mapping (uint256 => address) _tokenApprovals;
    mapping (address => mapping (address => bool)) _operatorApprovals;

    modifier _requirMinted(uint256 tokenId) {
        require(_exists(tokenId), "not minted");
        _;
    }

    constructor(string memory name_, string memory symbol_) {
        _name = name_;
        _symbol = symbol_;
    }

    function name() external view returns (string memory) {
        return _name;
    }

    function symbol() external view returns (string memory){
        return _symbol;
    }


    function balanceOf (address _owner) external view returns (uint256) {
        require (_owner != address(0), "Zero address");

        return _balances[_owner];
    }



    function transferFrom (address _from, address _to, uint256 _tokenId) external {
        require (_isApprovedOrOwner(msg.sender, _tokenId), "not is owner or approved!");

        _transfer(_from, _to, _tokenId);
    }

    function safeTransferFrom (address _from, address _to, uint256 _tokenId) external {
        require (_isApprovedOrOwner(msg.sender, _tokenId), "not is owner or approved!");

        _safeTransfer(_from, _to, _tokenId);

    }

    function _baseURI() internal pure virtual returns (string memory) {
        return "";
    }

    function tokenURI(uint256 _tokenId) public view _requirMinted(_tokenId) returns (string memory) {
        string memory baseURI = _baseURI();

        return bytes(baseURI).length > 0 ?
            string(abi.encodePacked(baseURI, _tokenId.toString())):
            "";

    }

    function ownerOf(uint256 _tokenId) public view _requirMinted(_tokenId) returns (address) {
        return _owners[_tokenId];
    }

    function approve (address _to, uint256 _tokenId) public {
        address _owner = ownerOf(_tokenId);
        require(_owner == msg.sender || isApprovedForAll(_owner, msg.sender), "not an owner");

        require(_to != _owner, " cannot approve to self");

        _tokenApprovals[_tokenId] = _to;

        emit Approval(_owner,_to,_tokenId);
    }

    function setApprovalForAll (address _operator, bool _approved) external {
        require (msg.sender != _operator, "cannot approve to self");
        
        _operatorApprovals[msg.sender][_operator] = _approved;

        emit ApprovalForAll(msg.sender, _operator, _approved);
    }



    function isApprovedForAll (address _owner, address _operator) public view returns (bool) {
        return _operatorApprovals[_owner][_operator];
    }

    function getApproved (uint256 _tokenId) public view _requirMinted(_tokenId) returns (address) {
        return  _tokenApprovals[_tokenId];
    }

    function _burn (uint256 _tokenId) public virtual {
        require (_isApprovedOrOwner(msg.sender,_tokenId), "not is owner");
        address owner = ownerOf(_tokenId);

        delete _tokenApprovals[_tokenId];
        _balances[owner]--;
        delete _owners[_tokenId];
    }


    function _safeMint (address _to, uint256 _tokenId) internal virtual {
        _mint(_to, _tokenId);

        require (_checkOnERC721Recived(msg.sender, _to, _tokenId), "non erc721 reciver");

    }

    function _mint(address _to, uint256 _tokenId) internal virtual {
        require (_to != address(0), "to cannot be zero");
        require (!_exists(_tokenId), "already exists");

        _owners[_tokenId] = _to;
        _balances[_to]++;
    }

    function _safeTransfer (address _from, address _to, uint256 _tokenId) internal {

        require (_checkOnERC721Recived(_from, _to, _tokenId), "non erc721 reciver");
        
        _transfer(_from, _to, _tokenId);
    }

    function _checkOnERC721Recived (address _from, address _to, uint256 _tokenId) private returns (bool) {
        if(_to.code.length > 0){ 
            try IERC721Receiver(_to).onERC721Received(msg.sender, _from, _tokenId, bytes("")) returns(bytes4 ret) {
                return ret == IERC721Receiver.onERC721Received.selector;
            } catch(bytes memory reason)  {
                if(reason.length == 0) {
                    revert ("Non ERC721 Reciver");
                } else {
                    assembly {
                        revert(add(32,reason), mload(reason))
                    }
                }
            }
        } else {
            return true;
        }
    }

    function _transfer (address _from, address _to, uint256 _tokenId) internal {
        require (ownerOf(_tokenId) == _from, "not an owner");
        require (_to != address(0), "to cannot be zero");

        _beforTokenTransfer(_from,_to,_tokenId);

        _balances[_from]--;
        _balances[_to]++;
        _owners[_tokenId] = _to;

        emit Transfer(_from,_to,_tokenId);

        _beforTokenTransfer(_from,_to,_tokenId);

    }

    function _beforTokenTransfer(address _from, address _to, uint256 _tokenId) internal virtual{
        
    }
    function _afterTokenTransfer(address _from, address _to, uint256 _tokenId) internal virtual{

    }

    function _isApprovedOrOwner (address _spender, uint256 _tokenId) internal view returns (bool) {
        address owner = ownerOf(_tokenId);

        require(
            _spender == owner ||
            isApprovedForAll(owner,_spender) ||
            getApproved(_tokenId) == _spender,
            "not an owner or approved"
        );
        return true;
    }

    function _exists(uint256 tokenId) internal view returns (bool){
        return _owners[tokenId] != address(0);
    }

}

