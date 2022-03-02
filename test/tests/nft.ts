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

  const [deployer, wallet1, wallet2] = provider.getWallets();

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
    const transfersLocked = true;

    elfNFT = await tokenDeployer.deploy(
      "Elfie NFT",
      "ELFNFT",
      deployer.address,
      transfersLocked
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

  describe("transferFrom", async () => {
    it("should not transfer an NFT", async () => {
      minter = minter.connect(wallet1);
      const leaves = merkleTree.getLeaves();
      const merkleProof = merkleTree.getHexProof(leaves[1]);
      await minter.mint(1, merkleProof);
      const owner = await elfNFT.ownerOf(1);

      try {
        await elfNFT.transferFrom(owner, wallet2.address, 1);
      } catch (error) {
        expect((error as Error)?.message).to.include("TRANSFERS_LOCKED");
      }
    });

    it("should transfer an NFT", async () => {
      await minter.connect(deployer).setTransfersLocked(false);

      const leaves = merkleTree.getLeaves();
      const merkleProof = merkleTree.getHexProof(leaves[1]);
      await minter.connect(wallet1).mint(1, merkleProof);

      elfNFT = elfNFT.connect(wallet1);
      await elfNFT.transferFrom(wallet1.address, wallet2.address, 1);
      const owner = await elfNFT.ownerOf(1);
      expect(owner).to.equal(wallet2.address);
    });
  });
});
