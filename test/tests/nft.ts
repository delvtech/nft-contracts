import { expect } from "chai";
import { waffle } from "hardhat";
import { MerkleTree } from "merkletreejs";
import { Account, getMerkleTree } from "test/helpers/merkle";
import { createSnapshot, restoreSnapshot } from "test/helpers/snapshots";
import {
  ElfNFT,
  ElfNFT__factory,
  Minter,
  Minter__factory,
} from "typechain-types";

const { provider } = waffle;

describe("ElfNFT", function () {
  let elfNFT: ElfNFT;
  let minter: Minter;
  let merkleTree: MerkleTree;

  const [deployer, wallet1] = provider.getWallets();

  before(async function () {
    await createSnapshot(provider);

    const signers = provider.getWallets();
    const accounts: Account[] = [];
    for (const i in signers) {
      accounts.push({
        address: signers[i].address,
        value: i,
      });
    }

    merkleTree = await getMerkleTree(accounts);
    const merkleRoot = merkleTree.getHexRoot();

    const tokenDeployer = new ElfNFT__factory(deployer);
    const minterDeployer = new Minter__factory(deployer);

    elfNFT = await tokenDeployer.deploy(
      "Elfie NFT",
      "ELFNFT",
      deployer.address,
      "ipfs.io/ipfs/abc"
    );

    minter = await minterDeployer.deploy(elfNFT.address, merkleRoot);
    await elfNFT.setOwner(minter.address);
  });

  after(async () => {
    await restoreSnapshot(provider);
  });

  beforeEach(async () => {
    await createSnapshot(provider);
  });

  afterEach(async () => {
    await restoreSnapshot(provider);
  });

  interface Error {
    message: string;
  }

  describe("tokenURI", async () => {
    // The ERC721 should not be able to mint tokens directly
    it("should return the URI", async () => {
      minter = minter.connect(wallet1);
      const leaves = merkleTree.getLeaves();
      const merkleProof = merkleTree.getHexProof(leaves[1]);
      await minter.mint(1, merkleProof);

      const tokenURI = await elfNFT.tokenURI(1);
      expect(tokenURI).to.equal("ipfs.io/ipfs/abc/1.png");
    });
  });
});
