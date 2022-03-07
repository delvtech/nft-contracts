import { Signer } from "ethers";

import { ElfNFT } from "../typechain-types/ElfNFT";
import { ElfNFT__factory } from "../typechain-types/factories/ElfNFT__factory";

export async function deployElfNFT(
  signer: Signer,
  name: string,
  symbol: string,
  baseURI: string
): Promise<ElfNFT> {
  const nftDeployer = new ElfNFT__factory(signer);
  const owner = await signer.getAddress();

  const nftContract = await nftDeployer.deploy(
    "Elf NFT",
    "elfnft",
    owner,
    baseURI
  );

  return nftContract;
}
