import { BytesLike, Signer } from "ethers";
import hre from "hardhat";
import { Minter__factory } from "typechain-types/factories/Minter__factory";
import { Minter } from "typechain-types/Minter";

export async function deployMinter(
  signer: Signer,
  networkId: number,
  nftAddress: string,
  merkleRoot: BytesLike
): Promise<Minter> {
  console.log("deployMinter");

  const minterDeployer = new Minter__factory(signer);

  const constructorArguments: [string, BytesLike] = [nftAddress, merkleRoot];
  console.log("constructorArguments", constructorArguments);

  const minterContract = await minterDeployer.deploy(...constructorArguments);
  console.log("minterContract deployed at ", minterContract.address);

  try {
    await hre.run("verify:verify", {
      network: networkId,
      address: minterContract.address,
      constructorArguments,
    });
  } catch (error) {
    console.log("Couldnt verify minter contract contract", error);
  }

  console.log("");
  return minterContract;
}
