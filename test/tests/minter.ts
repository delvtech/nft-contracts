import { expect } from "chai";
import { ethers, waffle } from "hardhat";
import { createSnapshot, restoreSnapshot } from "test/helpers/snapshots";
import { ElfToken, Minter } from "typechain";

const { provider } = waffle;

describe("Minter", function () {
  let elfNFT: ElfToken;
  let minter: Minter;

  const [deployer, wallet1] = provider.getWallets();

  before(async function () {
    await createSnapshot(provider);

    const tokenDeployer = await ethers.getContractFactory("ElfToken", deployer);
    const minterDeployer = await ethers.getContractFactory("Minter", deployer);

    elfNFT = await tokenDeployer.deploy(
      "Elfie NFT",
      "ELFNFT",
      deployer.address
    );

    minter = await minterDeployer.deploy(elfNFT.address);
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
  describe("mint", async () => {
    // The ERC721 should not be able to mint tokens directly
    it("token should not mint an NFT", async () => {
      elfNFT.connect(wallet1);
      try {
        await elfNFT.mint(wallet1.address, "1");
      } catch (error) {
        expect((error as Error)?.message).to.include("Sender not owner'");
      }
    });

    it("minter should mint an NFT", async () => {
      minter.connect(wallet1);
      await minter.mint(wallet1.address, "1");
      const owner = await elfNFT.ownerOf("1");

      expect(owner).to.equal(wallet1.address);
    });
  });
});
