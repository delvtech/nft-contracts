import { Signer } from "ethers";
import hre from "hardhat";

import { ElfNFT } from "typechain-types/ElfNFT";
import { ElfNFT__factory } from "typechain-types/factories/ElfNFT__factory";

export async function deployElfNFT(
  signer: Signer,
  networkId: number,
  name: string,
  symbol: string,
  baseURI: string
): Promise<ElfNFT> {
  console.log("deployElfNFT");

  const nftDeployer = new ElfNFT__factory(signer);
  const owner = await signer.getAddress();

  const constructorArguments: [string, string, string, string] = [
    name,
    symbol,
    owner,
    baseURI,
  ];
  console.log("constructorArguments", ...constructorArguments);

  const nftContract = await nftDeployer.deploy(...constructorArguments);
  console.log("nftContract deployed at ", nftContract.address);

  // wait for contract to be deployed before verifying
  console.log("waiting to verify");
  await sleep(40000);

  try {
    await hre.run("verify:verify", {
      network: networkId,
      address: nftContract.address,
      constructorArguments,
    });
  } catch (error) {
    console.log("Couldnt verify ElfNFT contract", error);
  }

  console.log("");
  return nftContract;
}
export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
