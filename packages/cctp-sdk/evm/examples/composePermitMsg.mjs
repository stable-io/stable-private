// Copyright (c) 2025 Stable Technologies Inc
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { usdc } from "@stable-io/cctp-sdk-definitions";
import { ViemEvmClient } from "@stable-io/cctp-sdk-viem";
import { EvmAddress } from "../dist/address.js";
import { composePermitMsg } from "../dist/utils.js";

const main = async () => {
  const client = new ViemEvmClient("Ethereum");
  const token = new EvmAddress("0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48");
  const owner = new EvmAddress("0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48");
  const spender = new EvmAddress("0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48");
  const value = usdc(1000);
  const result = await composePermitMsg(client, token, owner, spender, value);
  console.info(result);
};

main();
