import "tsconfig-paths/register";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";

import { HardhatUserConfig } from "hardhat/config";
import { existsSync, readFileSync } from "fs";

const EXPECTED_ACCOUNT_FILE = "accounts.json";

// Expects a json file with a list of private keys
const getAddresses = (): string[] | undefined => {
  if (existsSync(EXPECTED_ACCOUNT_FILE)) {
    console.log("External list of addresses loaded.");
    const externalAccounts = readFileSync(EXPECTED_ACCOUNT_FILE);
    return JSON.parse(externalAccounts.toString());
  }

  console.warn(
    "Could not find external account list, defaulting to hardhat defaults."
  );
};

const addresses = getAddresses();

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  solidity: {
    compilers: [
      {
        version: "0.8.3",
        settings: {
          optimizer: {
            enabled: true,
            runs: 7500,
          },
        },
      },
    ],
  },
  mocha: { timeout: 0 },
  networks: {
    hardhat: {
      accounts: addresses
        ? addresses.map((address) => ({
            privateKey: address,
            balance: "100000000000000000000000",
          }))
        : {
            accountsBalance: "100000000000000000000000", // 100000 ETH
            count: 5,
          },
    },
  },
};

export default config;
