# Elf Council NFTs

[![Build Status](https://github.com/delvtech/nft-contracts/workflows/Tests/badge.svg)](https://github.com/delvtech/nft-contracts/actions)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://github.com/delvtech/nft-contracts/blob/master/LICENSE)

Elf Council NFTs is a free NFT project that supports Element's governance protocol.

## Contributing to Elf Council NFTs

Elf Council NFTs is a community-driven project and there are many ways to contribute to it. We encourage you to jump in and improve and use this code whether that be contributing to Council directly, forking the governance framework for your own use, or just taking bits and pieces from it. We want everyone to build with us!

If you have a suggestion for a new feature, extension, or cool use case and want to help the community, drop by the #developers channel in our [discord](https://discord.gg/srgcTGccGe) to discuss and you will have a warm welcome!

When contributing, please be sure to follow our contribution [guidelines](https://github.com/delvtech/nft-contracts/blob/master/CONTRIBUTING.md) when proposing any new code. Lastly, because Council is a community-driven governance protocol, any new code contributions are more likely to be accepted into future deployments of the protocol if they have been openly discussed within the community first.

## Getting started

### Install prerequisites

- [Install npm](https://nodejs.org/en/download/)

### Setup

```bash
git clone git@github.com:delvtech/nft-contracts.git
```

```bash
cd nft-contracts
npm install
```

Create valid .env and provide external accounts to accounts.json (private keys). Check out our examples for help.

### Build

```bash
npm run build
```

### Run locally

Requires .env to have
  - PRIVATE_KEY
  - MERKLE_ROOT
  - IPFS_ROOT

If you need a merkle root we have a helper script which builds a merkle tree from the external accounts you provided with accounts.json. This script will output the merkle tree and the merkle proofs.

```bash
npm run generate-merkle
```

```bash
# start hardhat network
npm run dev 

# in another terminal
npm run deploy-local
```

### Deploy

Requires .env to have following variables. These will vary depending on target network.
  - PRIVATE_KEY
  - MERKLE_ROOT
  - ALCHEMY_RPC_HOST
  - CHAIN_ID
  - IPFS_ROOT

```bash
npm run deploy-mainnet
```

### Test

```bash
npm run test
```


If you have any questions, feedback, ideas for improvement, or even further experiments to test out with Council, come join our [#governance](https://discord.gg/z4EsSuaYCd) discord channel to talk more about this!
