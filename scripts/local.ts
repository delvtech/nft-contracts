import { ethers } from "hardhat";

const GOERLI_2_MERKLE_ROOT =
  "0x57e03ba2cdef4ae7d67fa76bb3ecdd3f8069ad75e1594a9ee44cba8af9012e91";

async function main() {
  const signers = await ethers.getSigners();

  // Deployer signer
  const [deployer] = signers;

  // Build contract factories
  const tokenDeployer = await ethers.getContractFactory("ElfNFT");
  const minterDeployer = await ethers.getContractFactory("Minter");

  // Deploy contracts
  const elfNFT = await tokenDeployer.deploy(
    "Elfie NFT",
    "ELFNFT",
    deployer.address
  );

  const minter = await minterDeployer.deploy(
    elfNFT.address,
    GOERLI_2_MERKLE_ROOT
  );

  // Set owner for nft contract to minter
  await elfNFT.setOwner(minter.address);

  console.log("nft contract deployed at ", elfNFT.address);
  console.log("minter contract deployed at ", minter.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });