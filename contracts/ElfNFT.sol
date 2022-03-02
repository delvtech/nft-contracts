// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity >=0.8.0;

import "@rari-capital/solmate/src/tokens/ERC721.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./Authorizable.sol";

contract ElfNFT is ERC721, Authorizable {
    bool public transfersLocked;

    using Strings for uint256;

    /// @notice constructor
    /// @param _name the name of the NFT
    /// @param _symbol the symbol of the NFT
    constructor(
        string memory _name,
        string memory _symbol,
        address _owner,
        bool _transfersLocked
    ) ERC721(_name, _symbol) {
        setOwner(_owner);
        setTransfersLocked(_transfersLocked);
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

    function transferFrom(
        address from,
        address to,
        uint256 id
    ) public virtual override {
        require(!transfersLocked, "TRANSFERS_LOCKED");

        require(from == ownerOf[id], "WRONG_FROM");

        require(to != address(0), "INVALID_RECIPIENT");

        require(
            msg.sender == from ||
                msg.sender == getApproved[id] ||
                isApprovedForAll[from][msg.sender],
            "NOT_AUTHORIZED"
        );

        // Underflow of the sender's balance is impossible because we check for
        // ownership above and the recipient's balance can't realistically overflow.
        unchecked {
            balanceOf[from]--;

            balanceOf[to]++;
        }

        ownerOf[id] = to;

        delete getApproved[id];

        emit Transfer(from, to, id);
    }

    function setTransfersLocked(bool locked) public onlyOwner {
        transfersLocked = locked;
    }

    /// @notice Base URI for computing tokenURI
    function _baseURI() internal pure returns (string memory) {
        return "https://nft.element.fi/nft/";
    }

    function mint(address to, uint256 tokenId) public onlyOwner {
        // TODO: add merkle checking in here
        // TODO: add a check to make sure the tokenId doesn't already exist
        _mint(to, tokenId);
    }
}
