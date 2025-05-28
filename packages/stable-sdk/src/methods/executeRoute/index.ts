// Copyright (c) 2025 Stable Technologies Inc
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { ViemEvmClient } from "@stable-io/cctp-sdk-viem";
import type { Network } from "@stable-io/cctp-sdk-definitions";
import { evmGasToken } from "@stable-io/cctp-sdk-definitions";
import { Route, SDK } from "../../types/index.js";

import { executeRouteSteps } from "./executeRouteSteps.js";
import { findTransferAttestation } from "./findTransferAttestation.js";
import { findTransferRedeem } from "./findTransferRedeem.js";


export type ExecuteRouteDeps<N extends Network> = Pick<SDK<N>, "getNetwork" | "getRpcUrl" | "getSigner">;

export const $executeRoute =
  <N extends Network>({
    getSigner,
    getNetwork,
    getRpcUrl,
  }: ExecuteRouteDeps<N>): SDK<N>["executeRoute"] =>
  async (route: Route) => {
    const signer = getSigner(route.intent.sourceChain);
    const network = getNetwork();
    const rpcUrl = getRpcUrl(route.intent.sourceChain);
    const client = ViemEvmClient.fromNetworkAndDomain(
      network,
      route.intent.sourceChain,
      rpcUrl,
    );

    const transactions = await executeRouteSteps(route, signer, client);

    const attestation = await findTransferAttestation();
    route.progress.emit("transfer-confirmed", {});

    const redeem = await findTransferRedeem();
    route.progress.emit("transfer-redeemed", {});

    return transactions;
  };