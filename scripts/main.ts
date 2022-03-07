import "dotenv/config";
import { providers, Wallet } from "ethers";

import { deployElfNFT } from "./deployElfNFT";
import { deployMinter } from "./deployMinter";

const { PRIVATE_KEY, MERKLE_ROOT, ALCHEMY_GOERLI_RPC_HOST } = process.env;

async function main() {
  const provider = new providers.JsonRpcProvider(ALCHEMY_GOERLI_RPC_HOST);
  const deployer = new Wallet(PRIVATE_KEY, provider);

  const nftContract = await deployElfNFT(
    deployer,
    "Elfie NFT",
    "ELFNFT",
    "ipfs.io/ipfs/abc"
  );
  console.log("nftContract", nftContract.address);

  const minterContract = await deployMinter(
    deployer,
    nftContract.address,
    MERKLE_ROOT
  );
  console.log("minterContract", minterContract.address);

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
