// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity >=0.8.0;

import "@rari-capital/solmate/src/tokens/ERC721.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "./ElfNFT.sol";

contract Minter {
    // The ERC721 contract to mint
    ElfNFT public immutable elfNFT;

    // The merkle root with deposits encoded into it as hash [address, tokenId]
    // Assumed to be a node sorted tree
    bytes32 public rewardsRoot;

    constructor(address _token, bytes32 _rewardsRoot) {
        elfNFT = ElfNFT(_token);
        rewardsRoot = _rewardsRoot;
    }

    /// @notice mints an NFT for an approved account in the merkle tree
    function mint(uint256 tokenId, bytes32[] memory merkleProof) public {
        // Hash the user plus the token id
        bytes32 leafHash = keccak256(abi.encodePacked(msg.sender, tokenId));

        // Verify the proof for this leaf
        require(
            MerkleProof.verify(merkleProof, rewardsRoot, leafHash),
            "Invalid Proof"
        );

        // mint the token, assuming it hasn't already been minted
        elfNFT.mint(msg.sender, tokenId);
    }
}
