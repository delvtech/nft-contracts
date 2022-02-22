// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity >=0.8.0;

import "@rari-capital/solmate/src/tokens/ERC721.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./Authorizable.sol";

contract ElfNFT is ERC721, Authorizable {
    using Strings for uint256;

    /// @notice constructor
    /// @param _name the name of the NFT
    /// @param _symbol the symbol of the NFT
    constructor(
        string memory _name,
        string memory _symbol,
        address _owner
    ) ERC721(_name, _symbol) {
        setOwner(_owner);
    }

    /// @notice retrieves the tokenURI, which will be a concatenation of the
    /// 'baseURI' and the 'tokenId'
    /// @param tokenId an identifier for the token
    function tokenURI(uint256 tokenId)
        public
        pure
        override
        returns (string memory)
    {
        // TODO: add a check to make sure the tokenId exists
        string memory baseURI = _baseURI();
        return
            bytes(baseURI).length > 0
                ? string(abi.encodePacked(baseURI, tokenId.toString()))
                : "";
    }

    /// @notice Base URI for computing tokenURI
    function _baseURI() internal pure returns (string memory) {
        return "https://nft.element.fi/nft/";
    }

    /// @notice Mints a new NFT if it hasn't already been minted
    /// @param to the address that will own the tokwn
    /// @param tokenId the id of the NFT to be minted
    function mint(address to, uint256 tokenId) public onlyOwner {
        _mint(to, tokenId);
    }
}
