// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity >=0.8.0;

import "@rari-capital/solmate/src/tokens/ERC721.sol";
import "./ElfNFT.sol";

contract Minter {
    ElfNFT public elfNFT;

    constructor(address _token) {
        elfNFT = ElfNFT(_token);
    }

    function mint(address who, uint256 tokenId) public {
        elfNFT.mint(who, tokenId);
    }
}
