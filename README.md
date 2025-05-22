### Stable
## Project Overview
Currently there's three sub-projects in this monorepo:
- cctpr (`contracts/cctpr`): An on-chain relaying protocol built on top of cctpv1, v2 and avax hop
- cctp-sdk (`packages/cctp-sdk/*`): Robust low-level SDK for interacting with CCTP, CCTPv2 and CCTPR.
- stable-sdk (`packages/stable-sdk`): High-level interface exposing cctpr (and other protocols to come) with a focus on developer ergonomics.
Se more info the README file for each workspace.

## Getting Started:
1. Install dependencies and build project:
```
corepack enable # enable yarn. Only required first time.
yarn install --immutable # install dependencies
yarn build # builds every package
```
2. Run examples:
```shell
# requires `packages/stable-sdk/.env` file to have an `EVM_PRIVATE_KEY` variable
yarn workspace @stable-io/sdk tsx examples/executeRoute.ts
```



