import { BytesLike, Signer } from "ethers";
import hre from "hardhat";
import { Minter__factory } from "typechain-types/factories/Minter__factory";
import { Minter } from "typechain/Minter";
import { localChainID } from "../constants";

export async function deployMinter(
  signer: Signer,
  networkId: number,
  nftAddress: string,
  merkleRoot: BytesLike
): Promise<Minter> {
  console.log("🚀 Deploying Minter... \n");

  const minterDeployer = new Minter__factory(signer);

  const constructorArguments: [string, BytesLike] = [nftAddress, merkleRoot];
  console.log("Constructor arguments");
  console.table(constructorArguments);

  const minterContract = await minterDeployer.deploy(...constructorArguments);
  console.log("✅ Minter contract deployed at", minterContract.address, "\n");

  // Skip verification if local network
  if (networkId === localChainID) {
    return minterContract;
  }

  // Wait for contract to be deployed before verifying
  console.log("⏳ Waiting to verify");
  await sleep(40000);

  try {
    await hre.run("verify:verify", {
      network: networkId,
      address: minterContract.address,
      constructorArguments,
    });
  } catch (error) {
    console.log("Could not verify minter contract contract", error);
  }

  console.log("\n");
  return minterContract;
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
