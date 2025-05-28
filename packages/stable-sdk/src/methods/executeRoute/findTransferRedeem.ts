// Copyright (c) 2025 Stable Technologies Inc
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { ViemEvmClient } from "@stable-io/cctp-sdk-viem";
import { domainIdOf, v1, v2 } from "@stable-io/cctp-sdk-definitions";
import { TODO, Url } from "@stable-io/utils";
import type { Network } from "../../types/index.js";
import type { Attestation, V1Attestation, V2Attestation } from "./findTransferAttestation.js";
import { EvmDomains } from "@stable-io/cctp-sdk-definitions";
import { parseAbiItem } from "viem/utils";
import { Hex } from "viem";

/**
 * @todo: this probably needs to be by chain.
 */
const REDEEM_SCAN_BLOCKS_BUFFER = 15n;

export async function findTransferRedeem<N extends Network>(
  network: N,
  rpcUrl: Url,
  attestation: Attestation,
) {
  const viemEvmClient = ViemEvmClient.fromNetworkAndDomain(
    network,
    attestation.targetChain,
    rpcUrl,
  );
  
  const startAtBlock = await viemEvmClient.getLatestBlock() - REDEEM_SCAN_BLOCKS_BUFFER;
  
  return attestation.cctpVersion === 1 ?
    await findTransferRedeemV1(network, viemEvmClient, attestation, startAtBlock) :
    await findTransferRedeemV2(viemEvmClient, attestation, startAtBlock);
};

const v1MessageReceivedEvent = parseAbiItem(
  "event MessageReceived(address indexed caller,uint32 sourceDomain,uint64 indexed nonce,bytes32 sender,bytes messageBody)",
);

async function findTransferRedeemV1<N extends Network, D extends keyof EvmDomains>(
  network: N,
  viemEvmClient: ViemEvmClient<N, D>,
  attestation: V1Attestation,
  startAtBlock: bigint,
) {
  const destContract = (v1.contractAddressOf as TODO)(network, attestation.targetChain, 0, 1);

  let fromBlock = startAtBlock;
  while (true) {
    console.log("getting logs from block", fromBlock.toString());
    const logs = await viemEvmClient.client.getLogs({
      address: destContract,
      event: v1MessageReceivedEvent,
      fromBlock,
    });

    const filteredLogs = logs.filter(log => log.args.sourceDomain === domainIdOf(attestation.sourceChain));
    if (filteredLogs.length > 1) {
      throw new Error(`Expected a single log, got ${filteredLogs.length}`);
    }

    if (filteredLogs.length > 0) {
      return { transactionHash: filteredLogs[0].transactionHash };
    }

    const lastBlockScanned = logs.reduce((max, log) => {
      if (log.blockNumber > max) return log.blockNumber;
      return max;
    }, fromBlock);

    console.log("last block received", lastBlockScanned.toString());
    fromBlock = lastBlockScanned + 1n;
    await new Promise(resolve => setTimeout(resolve, 50));
  }
};

const v2MessageReceivedEvent = parseAbiItem(
  "event MessageReceived(address indexed caller,uint32 sourceDomain,bytes32 indexed nonce,bytes32 sender,uint32 indexed finalityThresholdExecuted,bytes messageBody)",
);

async function findTransferRedeemV2<N extends Network, D extends keyof EvmDomains>(
  viemEvmClient: ViemEvmClient<N, D>,
  attestation: V2Attestation,
  startAtBlock: bigint,
) {
  const destContract = (v2.contractAddressOf as TODO)[attestation.targetChain][0][1];
};

async function scanBlocks<N extends Network, D extends keyof EvmDomains>(
  viemEvmClient: ViemEvmClient<N, D>,
  startAtBlock: bigint,
  destContract: string,
  sourceChain: keyof EvmDomains,
  nonce: bigint | string,
  event: TODO,
) {
  let fromBlock = startAtBlock;
  while (true) {
    const logs = await viemEvmClient.client.getLogs({
      address: destContract as Hex,
      event,
      fromBlock,
      args: { nonce },
    });

    const filteredLogs = logs.filter(log => log.args.sourceDomain === domainIdOf(sourceChain));
    if (filteredLogs.length > 0) {
      return { transactionHash: filteredLogs[0].transactionHash };
    }

    const lastBlockScanned = logs.reduce((max, log) => {
      if (log.blockNumber > max) return log.blockNumber;
      return max;
    }, fromBlock);

    fromBlock = lastBlockScanned + 1n;
    await new Promise(resolve => setTimeout(resolve, 50));
  }
}