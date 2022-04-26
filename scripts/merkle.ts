import { ethers } from "hardhat";
import { Account, getMerkleTree } from "test/helpers/merkle";

async function main() {
  // Fetch signers from HRE
  // This will be the provided account list
  const signers = await ethers.getSigners();

  // Account list for merkle proof
  const accounts: Account[] = signers.map((signer, i) => ({
    address: signer.address,
    value: i,
  }));

  // Build merkle tree
  const merkleTree = await getMerkleTree(accounts);
  const merkleRoot = merkleTree.getHexRoot();

  const leaves = merkleTree.getLeaves();
  const proofs = leaves.map((leaf) => merkleTree.getHexProof(leaf));

  console.log("✅ Merkle root is ", merkleRoot, "\n");
  console.log("✅ Merkle proofs for first 5 test accounts:");
  console.table(proofs.slice(0, 5));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
