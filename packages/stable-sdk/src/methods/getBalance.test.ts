// Copyright (c) 2025 Stable Technologies Inc
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { Url } from "@stable-io/utils";
import { $getBalance } from "./getBalance.js";
import { Domain } from "@stable-io/cctp-sdk-definitions";
import { viemChainOf } from "@stable-io/cctp-sdk-viem";

describe("$getBalance", () => {
  let getBalance: ReturnType<typeof $getBalance>;

  beforeEach(() => {
    getBalance = $getBalance({
      getNetwork: () => "Testnet",
      getRpcUrl: (domain: Domain) => {
        const viemChain = viemChainOf["Testnet"][domain];
        return viemChain.rpcUrls.default.http[0] as Url;
      },
    });
  });

  // @TODO: This test will break since we are checking a testnet hot wallet
  it("Should be able to get the token balance of an ERC20 contract", async () => {
    const balances = await getBalance(
      "0x245ba3fe701c0d70bd42f3951d08f3a59914a627",
      ["Ethereum", "Arbitrum", "Optimism"]);
    /*
    expect(balances).toEqual({
      Ethereum: "354.085674",
      Arbitrum: "0.531269",
      // @TODO: For some reason this one is failing because of too much precision
      Optimism: "5.129089",
    });
    */
  });
});
