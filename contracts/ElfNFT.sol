// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity >=0.8.0;

import "@rari-capital/solmate/src/tokens/ERC721.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./Authorizable.sol";

contract ElfNFT is ERC721, Authorizable {
    using Strings for uint256;

    string public baseURI;

    /// @notice constructor
    /// @param _name the name of the NFT
    /// @param _symbol the symbol of the NFT
    constructor(
        string memory _name,
        string memory _symbol,
        address _owner,
        string memory _baseURI
    ) ERC721(_name, _symbol) {
        setOwner(_owner);
        setBaseURI(_baseURI);
    }

    /// @notice retrieves the tokenURI, which will be a concatenation of the
    /// 'baseURI' and the 'tokenId'
    /// @param tokenId an identifier for the token
    function tokenURI(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        return
            bytes(baseURI).length > 0
                ? string(
                    abi.encodePacked(baseURI, "/", tokenId.toString(), ".png")
                )
                : "";
    }

    function setBaseURI(string memory _baseURI) public onlyOwner {
        baseURI = _baseURI;
    }

    function mint(address to, uint256 tokenId) public onlyOwner {
        // TODO: add merkle checking in here
        // TODO: add a check to make sure the tokenId doesn't already exist
        _mint(to, tokenId);
    }
}
