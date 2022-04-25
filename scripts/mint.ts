import "dotenv/config";

import { ethers, providers } from "ethers";
import { makeMerkle } from "test/helpers/makeMerkle";
import { Minter__factory } from "typechain/factories/Minter__factory";

const { PRIVATE_KEY, MERKLE_ROOT, ALCHEMY_RPC_HOST, CHAIN_ID } = process.env;

async function main() {
  const chainId = Number(CHAIN_ID) || 1;
  console.log("PRIVATE_KEY", PRIVATE_KEY);
  console.log("MERKLE_ROOT", MERKLE_ROOT);
  console.log("ALCHEMY_RPC_HOST", ALCHEMY_RPC_HOST);
  console.log("chainId", chainId);
  if (!ALCHEMY_RPC_HOST) {
    console.error("no provider url");
    return;
  }

  if (!CHAIN_ID) {
    console.error("no chain id provided");
    return;
  }

  if (!PRIVATE_KEY) {
    console.error("no private key provided for deployer");
    return;
  }

  if (!MERKLE_ROOT) {
    console.error("no merkle root provided for minter contract");
    return;
  }
  // rinkeby minter address;
  const minterContractAddress = "0x887EebeB6C6aC9F8D85FA56171797b91A4024e06";

  const localhostProvider = new providers.JsonRpcProvider(ALCHEMY_RPC_HOST);

  const owner = new ethers.Wallet(PRIVATE_KEY, localhostProvider);

  const ownerAddress = owner.address;
  console.log("ownerAddress", ownerAddress);

  const merkleTree = await makeMerkle();
  const merkleRoot = merkleTree.getHexRoot();
  console.log("merkleRoot", merkleRoot);

  const leaves = merkleTree.getLeaves();
  const proof = merkleTree.getHexProof(leaves[0]);
  console.log("proof", proof);

  const coder = new ethers.utils.AbiCoder();
  console.log("coder");
  try {
    const encoded = coder.encode(["bytes32", "bytes32"], proof);
    const bytes = encoded.slice(2); //remove 0x prepend
    console.log("bytes", bytes);
    console.log("bytes", bytes.length);
    // put into 32 byte chuncks
    const btyes32array = sliceIntoChunks(bytes, 64);
    console.log("btyes32array", btyes32array);
  } catch (error) {
    console.log("error", error);
  }

  const minterContract = Minter__factory.connect(minterContractAddress, owner);
  console.log("minterContract");

  try {
    const root = await minterContract.merkleRoot();
    console.log("root", root);
    const tx = await minterContract.mint(0, proof);
  } catch (error) {
    console.log("error", error);
  }

  console.log("minted elf 0");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
function sliceIntoChunks(arr: any[] | string, chunkSize: number) {
  const res = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize);
    res.push(chunk);
  }
  return res;
}
