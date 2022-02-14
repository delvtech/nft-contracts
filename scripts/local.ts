import { ethers } from "hardhat";
import { Account, getMerkleTree } from "test/helpers/merkle";

async function main() {
  const signers = await ethers.getSigners();

  // Deployer signer
  const [deployer] = signers;

  // Build contract factories
  const tokenDeployer = await ethers.getContractFactory("ElfNFT");
  const minterDeployer = await ethers.getContractFactory("Minter");

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

  // Deploy contracts
  const elfNFT = await tokenDeployer.deploy(
    "Elfie NFT",
    "ELFNFT",
    deployer.address
  );

  const minter = await minterDeployer.deploy(elfNFT.address, merkleRoot);

  // Set owner for nft contract to minter
  await elfNFT.setOwner(minter.address);

  console.log("nft contract deployed at ", elfNFT.address);
  console.log("minter contract deployed at ", minter.address);
  console.log("Merkle proofs for first 3 test accounts ", proofs.slice(0, 3));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
