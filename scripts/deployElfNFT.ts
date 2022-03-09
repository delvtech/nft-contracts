import { Signer } from "ethers";
import hre from "hardhat";

import { ElfNFT } from "../typechain-types/ElfNFT";
import { ElfNFT__factory } from "../typechain-types/factories/ElfNFT__factory";

export async function deployElfNFT(
  signer: Signer,
  name: string,
  symbol: string,
  baseURI: string,
  networkId: number
): Promise<ElfNFT> {
  const nftDeployer = new ElfNFT__factory(signer);
  const owner = await signer.getAddress();

  const nftContract = await nftDeployer.deploy(name, symbol, owner, baseURI);

  await hre.run("verify:verify", {
    network: networkId,
    address: nftContract.address,
    constructorArguments: [name, symbol, owner, baseURI],
  });

  return nftContract;
}
