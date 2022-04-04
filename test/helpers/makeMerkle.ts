import { Account, getMerkleTree } from "test/helpers/merkle";

export async function makeMerkle() {
  const address = "0x25b6c2d9b7c30f77fe94F195039E5C7780E963C2";
  const accounts: Account[] = [];

  for (let i = 0; i < 4; i++) {
    accounts.push({
      address,
      value: i,
    });
  }

  const merkleTree = await getMerkleTree(accounts);
  const merkleRoot = merkleTree.getHexRoot();
  // const proofs = [];
  // const leaves = merkleTree.getLeaves();
  // leaves.forEach((leaf) => {
  //   const proof = merkleTree.getHexProof(leaf);
  //   console.log("proof", proof);
  //   proofs.push(proof);
  // });
  console.log(merkleRoot);

  return merkleTree;
}
async function main() {
  await makeMerkle();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
