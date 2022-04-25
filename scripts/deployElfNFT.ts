import { Signer } from "ethers";
import hre from "hardhat";

import { ElfNFT } from "typechain/ElfNFT";
import { ElfNFT__factory } from "typechain/factories/ElfNFT__factory";

export async function deployElfNFT(
  signer: Signer,
  networkId: number,
  name: string,
  symbol: string,
  baseURI: string
): Promise<ElfNFT> {
  console.log("🚀 Deploying ElfNFT... \n");

  const nftDeployer = new ElfNFT__factory(signer);
  const owner = await signer.getAddress();

  const constructorArguments: [string, string, string, string] = [
    name,
    symbol,
    owner,
    baseURI,
  ];

  console.log("Constructor arguments");
  console.table(constructorArguments);

  const nftContract = await nftDeployer.deploy(...constructorArguments);
  console.log("✅ NFT contract deployed at", nftContract.address, "\n");

  // Skip verification if local network
  if (networkId === 8545) {
    return nftContract;
  }

  // Wait for contract to be deployed before verifying
  console.log("⏳ Waiting to verify");
  await sleep(40000);

  try {
    await hre.run("verify:verify", {
      network: networkId,
      address: nftContract.address,
      constructorArguments,
    });
  } catch (error) {
    console.log("Could not verify ElfNFT contract", error);
  }

  console.log("\n");
  return nftContract;
}
export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
