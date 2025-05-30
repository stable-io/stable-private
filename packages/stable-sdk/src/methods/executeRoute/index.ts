// Copyright (c) 2025 Stable Technologies Inc
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.
import { ViemEvmClient } from "@stable-io/cctp-sdk-viem";
import type { Network } from "@stable-io/cctp-sdk-definitions";
import { avaxRouterContractAddress } from "@stable-io/cctp-sdk-cctpr-definitions";
import { Route, SDK } from "../../types/index.js";

import { executeRouteSteps } from "./executeRouteSteps.js";
import { CctpAttestation, findTransferAttestation } from "./findTransferAttestation.js";
import { findTransferRedeem } from "./findTransferRedeem.js";
import { Redeem } from "src/types/redeem.js";

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

    /**
     * @todo: we could get and return signatures along with the transactions and
     *        we'd be providing all infromation the integrator may possibly need.
     * @todo: review return value of executeRouteSteps. Having only the tx hashes
     *        makes it hard/unreliable to know which is the transfer transaction.
     *        For the time being we can get our way by getting the last tx, but
     *        this wouldn't resist integrating protocols with multiple transactions.
     */
    const userTransactions = await executeRouteSteps(network, route, signer, client);
    const transferTx = userTransactions.at(-1)!; // there's always 1 or 2 hashes.

    const attestations = [] as CctpAttestation[];
    const redeems = [] as Redeem[];

    const attestation = await findTransferAttestation(
      network,
      route.intent.sourceChain,
      transferTx,
    );
    attestations.push(attestation);
    route.progress.emit("transfer-confirmed", attestation);

    const avaxRouterAddress = avaxRouterContractAddress[network];

    const isAvaxHop = attestation.destinationCaller === avaxRouterAddress &&
      attestation.targetDomain === "Avalanche";

    /**
     * Note that we use attestation.targetChain to find the redeem
     * because in the case of avax hop, there's an intermediate
     * redeem on avalanche.
     */
    const redeem = await findTransferRedeem(
      network,
      getRpcUrl(attestation.targetDomain),
      attestation,
    );
    redeems.push(redeem);

    /**
     * If it's avax hop, then we have redeemed the first
     * leg of the avax hop, and we need to find the second
     * transfer.
     *
     * Note that:
     * - "transfer-confirmed" is emitted when circle attests the first
     *   leg since this materializes the transfer.
     * - "transfer-redeemed", in contrast, is emitted when the transfer
     *   makes it to the target user, which means after the second
     *   transaction in the avax-hop case.
     */
    if (isAvaxHop) {
      route.progress.emit("hop-redeemed", redeem); // uses redeem

      const secondHopAttestation = await findTransferAttestation(
        network,
        attestation.targetDomain,
        redeem.transactionHash,
      );
      attestations.push(secondHopAttestation);
      route.progress.emit("hop-confirmed", secondHopAttestation); // uses hop attestation

      const secondHopRedeem = await findTransferRedeem(
        network,
        getRpcUrl(secondHopAttestation.targetDomain),
        secondHopAttestation,
      );
      redeems.push(secondHopRedeem);
      route.progress.emit("transfer-redeemed", secondHopRedeem); // uses hopRedeem
    }

    else {
      route.progress.emit("transfer-redeemed", redeem); // uses redeem
    }

    return { userTransactions, attestations, redeems } as any;
  };
