import "dotenv/config";
import { providers, Wallet } from "ethers";
import { localChainID, localhostProvider } from "../constants";
import { deployElfNFT } from "./deployElfNFT";
import { deployMinter } from "./deployMinter";

const { PRIVATE_KEY, MERKLE_ROOT, IPFS_ROOT } = process.env;

async function main() {
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

  const provider = new providers.JsonRpcProvider(localhostProvider);
  const deployer = new Wallet(PRIVATE_KEY, provider);

  // Deploy NFT contract
  const nftContract = await deployElfNFT(
    deployer,
    localChainID,
    "Elf NFT",
    "ELF",
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
    localChainID,
    nftContract.address,
    MERKLE_ROOT
  );

  await nftContract.setOwner(minterContract.address);
  console.log("✅ Owner set to minter address \n");
  console.log("🔥 Done");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
