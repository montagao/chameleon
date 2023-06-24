// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


contract myNFT {
    uint256 public tokenCounter;
    mapping(uint256 => string) public tokenURIs;

    constructor() {
        tokenCounter = 0;
    }

    function createToken(string memory _tokenURI) public returns (uint256) {
        uint256 newItemId = tokenCounter;
        tokenURIs[newItemId] = _tokenURI;
        tokenCounter = tokenCounter + 1;
        return newItemId;
    }
}
