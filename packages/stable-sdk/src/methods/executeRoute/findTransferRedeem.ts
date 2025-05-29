// Copyright (c) 2025 Stable Technologies Inc
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { ViemEvmClient } from "@stable-io/cctp-sdk-viem";
import { domainIdOf, v1, v2 } from "@stable-io/cctp-sdk-definitions";
import { TODO, Url } from "@stable-io/utils";
import type { Network } from "../../types/index.js";
import type { CctpAttestation } from "./findTransferAttestation.js";
import { EvmDomains } from "@stable-io/cctp-sdk-definitions";
import { parseAbiItem } from "viem/utils";
import type { Hex } from "viem";
import type { Redeem } from "src/types/redeem.js";

/**
 * @todo: Should be configured by chain.
 */
const REDEEM_SCAN_BLOCKS_BUFFER = 15n;

export async function findTransferRedeem<N extends Network>(
  network: N,
  rpcUrl: Url,
  attestation: CctpAttestation,
): Promise<Redeem> {
  const viemEvmClient = ViemEvmClient.fromNetworkAndDomain(
    network,
    attestation.targetDomain,
    rpcUrl,
  );
  
  let fromBlock = await viemEvmClient.getLatestBlock() - REDEEM_SCAN_BLOCKS_BUFFER;
  while (true) {
    const [latestBlock, logs] = await Promise.all([
      viemEvmClient.getLatestBlock(),
      attestation.cctpVersion === 1 ?
        getV1RedeemLogs(network, viemEvmClient, attestation.nonce, attestation.targetDomain, fromBlock) :
        await getV2RedeemLogs(network, viemEvmClient, attestation.nonce, attestation.targetDomain, fromBlock),
    ]);

    const filteredLogs = logs.filter(log => log.args.sourceDomain === domainIdOf(attestation.sourceDomain));
    if (filteredLogs.length > 1) {
      throw new Error(`Found multiple ${filteredLogs.length} redeem logs for the same nonce.`);
    }

    if (filteredLogs.length > 0) return { 
      destinationDomain: attestation.targetDomain,
      transactionHash: filteredLogs[0].transactionHash
    };

    fromBlock = latestBlock;

    await new Promise(resolve => setTimeout(resolve, 2000));
  }
};

const v1MessageReceivedEvent = parseAbiItem(
  "event MessageReceived(address indexed caller,uint32 sourceDomain,uint64 indexed nonce,bytes32 sender,bytes messageBody)",
);

async function getV1RedeemLogs<
  N extends Network,
  D extends keyof EvmDomains,
>(
  network: N,
  viemEvmClient: ViemEvmClient<N, D>,
  nonce: bigint,
  targetChain: keyof EvmDomains,
  fromBlock: bigint,
) {
  const destContract = (v1.contractAddressOf as TODO)(network, targetChain, 0, 1);

  return await viemEvmClient.client.getLogs({
    address: destContract,
    event: v1MessageReceivedEvent,
    fromBlock,
    args: {
      nonce,
    }
  });
};

const v2MessageReceivedEvent = parseAbiItem(
  "event MessageReceived(address indexed caller,uint32 sourceDomain,bytes32 indexed nonce,bytes32 sender,uint32 indexed finalityThresholdExecuted,bytes messageBody)",
);

async function getV2RedeemLogs<
  N extends Network,
  D extends keyof EvmDomains,
>(
  network: N,
  viemEvmClient: ViemEvmClient<N, D>,
  nonce: Hex,
  targetChain: keyof EvmDomains,
  fromBlock: bigint,
) {
  const destContract = (v2.contractAddressOf as TODO)(network, targetChain, 0, 1);

  return await viemEvmClient.client.getLogs({
    address: destContract,
    event: v2MessageReceivedEvent,
    fromBlock,
    args: {
      nonce,
    }
  });
};

