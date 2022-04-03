import "dotenv/config";
import { providers, Wallet } from "ethers";

import { deployElfNFT } from "./deployElfNFT";
import { deployMinter } from "./deployMinter";

const { PRIVATE_KEY, MERKLE_ROOT, ALCHEMY_RPC_HOST, CHAIN_ID } = process.env;

async function main() {
  const chainID = Number(CHAIN_ID) || 1;
  if (!ALCHEMY_RPC_HOST) {
    console.error("no provider url");
    return;
  }

  if (!CHAIN_ID) {
    console.error("no chain id provided");
    return;
  }

  if (!PRIVATE_KEY) {
    console.error("no private key provided for deployer");
    return;
  }

  if (!MERKLE_ROOT) {
    console.error("no merkle root provided for minter contract");
    return;
  }

  if (chainID !== 9000) {
    return;
  }

  const provider = new providers.JsonRpcProvider(ALCHEMY_RPC_HOST);
  const deployer = new Wallet(PRIVATE_KEY, provider);

  // deploy elf nft contract
  const nftContract = await deployElfNFT(
    deployer,
    chainID,
    "Elfie NFT",
    "ELFNFT",
    "ipfs://QmcsGvPN4yyPwA7fECzgPjX8nyfaCs3Rr9aW3MdnXm7M6S"
  );

  // authorize the deployer before we transfer ownership to the minter contract
  // so it can set the baseURI
  await nftContract.connect(deployer).authorize(deployer.address);
  console.log(
    "deployer address ",
    deployer.address,
    " authorized on nft contract"
  );

  const minterContract = await deployMinter(
    deployer,
    chainID,
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
