import "dotenv/config";
import { providers, Wallet } from "ethers";
import { deployElfNFT } from "./deployElfNFT";
import { deployMinter } from "./deployMinter";

const { PRIVATE_KEY, MERKLE_ROOT, ALCHEMY_RPC_HOST, CHAIN_ID, IPFS_ROOT } =
  process.env;

async function main() {
  const chainID = Number(CHAIN_ID) || 1;
  if (!ALCHEMY_RPC_HOST) {
    console.error(
      "⛔️ No provider url provided for minter contract. Add ALCHEMY_RPC_HOST variable to env."
    );
    return;
  }

  if (!CHAIN_ID) {
    console.error(
      "⛔️ No chain id provided for minter contract. Add CHAIN_ID variable to env."
    );

    return;
  }

  if (!PRIVATE_KEY) {
    console.error(
      "⛔️ No private key provided for the deployer. Add PRIVATE_KEY variable to env."
    );
    return;
  }

  if (!MERKLE_ROOT) {
    console.error(
      "⛔️ No merkle root provided for minter contract. Add PRIVATE_KEY variable to env."
    );
    return;
  }

  if (!IPFS_ROOT) {
    console.error(
      "⛔️ No ipfs content identifier root provided. Add IPFS_ROOT variable to env."
    );
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
    IPFS_ROOT
  );

  /* 
  Authorize the deployer before we transfer ownership to the minter contract 
  so it can set the baseURI 
  */
  await nftContract.connect(deployer).authorize(deployer.address);

  console.log(
    "✅ Deployer address ",
    deployer.address,
    " authorized on NFT contract \n"
  );

  // Deploy Minter contract
  const minterContract = await deployMinter(
    deployer,
    chainID,
    nftContract.address,
    MERKLE_ROOT
  );

  await nftContract.setOwner(minterContract.address);
  console.log("✅ Owner set to minter address \n");
  console.log("🔥 Done");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
