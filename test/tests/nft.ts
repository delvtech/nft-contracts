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

    await elfNFT.connect(deployer).authorize(deployer.address);

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

  describe("tokenURI", async () => {
    it("should return the URI", async () => {
      minter = minter.connect(wallet1);
      const leaves = merkleTree.getLeaves();
      const merkleProof = merkleTree.getHexProof(leaves[1]);
      await minter.mint(1, merkleProof);

      const tokenURI = await elfNFT.tokenURI(1);
      expect(tokenURI).to.equal("ipfs.io/ipfs/abc/1.png");
    });
  });

  describe("setBaseURI", async () => {
    it("should not set the base URI", async () => {
      minter = minter.connect(wallet1);
      const leaves = merkleTree.getLeaves();
      const merkleProof = merkleTree.getHexProof(leaves[1]);
      await minter.mint(1, merkleProof);

      const tokenURI = await elfNFT.tokenURI(1);
      expect(tokenURI).to.equal("ipfs.io/ipfs/abc/1.png");

      try {
        await elfNFT.connect(wallet1).setBaseURI("ipfs.io/ipfs/xyz");
      } catch (error) {
        expect((error as Error)?.message).to.include("Sender not Authorized");
      }
    });

    it("should set the base URI", async () => {
      minter = minter.connect(wallet1);
      const leaves = merkleTree.getLeaves();
      const merkleProof = merkleTree.getHexProof(leaves[1]);
      await minter.mint(1, merkleProof);

      const tokenURI = await elfNFT.tokenURI(1);
      expect(tokenURI).to.equal("ipfs.io/ipfs/abc/1.png");

      await elfNFT.connect(deployer).setBaseURI("ipfs.io/ipfs/xyz");

      const newTokenURI = await elfNFT.tokenURI(1);
      expect(newTokenURI).to.equal("ipfs.io/ipfs/xyz/1.png");
    });
  });
});
