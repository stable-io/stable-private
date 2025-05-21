// Copyright (c) 2025 Stable Technologies Inc
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { ViemEvmClient } from "@stable-io/cctp-sdk-viem";
import { Network, SDK } from "../types/index.js";
import { EvmAddress, getTokenBalance } from "@stable-io/cctp-sdk-evm";
import { init as initDefinitions, Usdc } from "@stable-io/cctp-sdk-definitions";

export type getBalanceDeps<N extends Network> = Pick<SDK<N>, "getNetwork" | "getRpcUrl">;

export const $getBalance =
  <N extends Network>({
    getNetwork,
    getRpcUrl,
  }: getBalanceDeps<N>): SDK<N>["getBalance"] =>
  async (address, domains): ReturnType<SDK<N>["getBalance"]> => {
    const network = getNetwork();
    const definitions = initDefinitions(network);
    const evmAddress = new EvmAddress(address);
    const balances = await Promise.all(domains.map(async (domain) => {
      const rpcUrl = getRpcUrl(domain);
      const viemEvmClient = ViemEvmClient.fromNetworkAndDomain(
        network,
        domain,
        rpcUrl,
      );
      const contract = new EvmAddress(definitions.usdcContracts.contractAddressOf[domain]);
      const balance = await getTokenBalance(viemEvmClient, contract, evmAddress, Usdc);
      return [domain, balance.toUnit("human").toString()];
    }));
    return Object.fromEntries(balances);
  };
