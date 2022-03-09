import { BytesLike, Signer } from "ethers";

import { Minter__factory } from "../typechain-types/factories/Minter__factory";
import { Minter } from "../typechain-types/Minter";

export async function deployMinter(
  signer: Signer,
  nftAddress: string,
  merkleRoot: BytesLike
): Promise<Minter> {
  const minterDeployer = new Minter__factory(signer);
  const minterContract = await minterDeployer.deploy(nftAddress, merkleRoot);

  return minterContract;
}
