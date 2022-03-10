import "dotenv/config";
import { providers, Wallet } from "ethers";

import { deployElfNFT } from "./deployElfNFT";
import { deployMinter } from "./deployMinter";

const { PRIVATE_KEY, MERKLE_ROOT, ALCHEMY_GOERLI_RPC_HOST } = process.env;

const GOERLI_CHAIN_ID = 5;
async function main() {
  if (!PRIVATE_KEY) {
    console.error("no private key provided for deployer");
    return;
  }

  if (!MERKLE_ROOT) {
    console.error("no merkle root provided for minter contract");
    return;
  }

  const provider = new providers.JsonRpcProvider(ALCHEMY_GOERLI_RPC_HOST);
  const deployer = new Wallet(PRIVATE_KEY, provider);

  // deploy elf nft contract
  const nftContract = await deployElfNFT(
    deployer,
    GOERLI_CHAIN_ID,
    "Elfie NFT",
    "ELFNFT",
    "ipfs.io/ipfs/abc"
  );

  // authorize the deployer before we transfer ownership to the minter contract
  // so it can set the baseURI
  await nftContract.connect(deployer).authorize(deployer.address);
  console.log("deployer address ", deployer, " authoriazed on nft contract");

  const minterContract = await deployMinter(
    deployer,
    GOERLI_CHAIN_ID,
    nftContract.address,
    MERKLE_ROOT
  );

  await nftContract.setOwner(minterContract.address);
  console.log("owner set to minter address");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
