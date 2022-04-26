import { BytesLike, Signer } from "ethers";
import { Minter__factory } from "typechain";
import { minterContractAddress } from "./addresses";

// Helper function to update merkle root on mainnet
export async function updateMerkleRoot(
  signer: Signer,
  merkleRoot: BytesLike
): Promise<void> {
  const minterContract = Minter__factory.connect(minterContractAddress, signer);
  const oldMerkleRoot = await minterContract.merkleRoot();
  console.log("oldMerkleRoot", oldMerkleRoot);

  const transaction = await minterContract.setRewardsRoot(merkleRoot);
  await transaction.wait(1);

  const newMerkleRoot = await minterContract.merkleRoot();
  console.log("newMerkleRoot", newMerkleRoot);
}
