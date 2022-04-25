import { Signer } from "ethers";
import { ElfNFT__factory } from "typechain/factories/ElfNFT__factory";
import { nftContractAddress } from "./addresses";

// Helper function to update base uri on mainnet
export async function updateBaseURI(
  signer: Signer,
  baseURI: string
): Promise<void> {
  const nftContract = ElfNFT__factory.connect(nftContractAddress, signer);
  const oldBaseURI = await nftContract.baseURI();
  console.log("oldBaseURI", oldBaseURI);
  const transaction = await nftContract.setBaseURI(baseURI);
  await transaction.wait(1);
  const newBaseURI = await nftContract.baseURI();
  console.log("newBaseURI", newBaseURI);
}
