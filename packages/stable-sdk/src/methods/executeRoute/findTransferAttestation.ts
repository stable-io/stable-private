// Copyright (c) 2025 Stable Technologies Inc
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { deserialize } from "binary-layout";
import { Hex } from "viem";
import { EvmDomains, UniversalAddress, v1, v2 } from "@stable-io/cctp-sdk-definitions";
import type { Address, Network, TxHash } from "../../types/index.js";
import { encoding } from "@stable-io/utils";

interface AttestationFetchConfig {
  timeoutMs?: number;
}

export async function findTransferAttestation<N extends Network>(
  network: N,
  sourceChain: keyof EvmDomains,
  transactionHash: TxHash,
  config: AttestationFetchConfig = {},
): Promise<CctpAttestation> {
  const baseDelayMs = 500;
  const maxDelayMs = 5000;
  const backoffMultiplier = 1.5;
  const jitterPercent = 0.2;
  const timeoutMs = config.timeoutMs ?? 30_000;
  const startTime = Date.now();

  let attempt = 0;
  let response: v2.GetMessagesResponse;

  while (true) {
    if (Date.now() - startTime > timeoutMs) {
      throw new Error(`Timeout after ${timeoutMs}ms waiting for transfer attestation`);
    }

    response = await v2.fetchMessagesFactory(network)(
      sourceChain,
      { transactionHash },
    );

    if (response.status === "success") {
      break;
    }

    ++attempt;
    const exponentialDelay = Math.min(
      baseDelayMs * Math.pow(backoffMultiplier, attempt - 1),
      maxDelayMs,
    );
    const jitter = (Math.random() - 0.5) * 2 * jitterPercent;
    const delayWithJitter = Math.round(exponentialDelay * (1 + jitter));
    await new Promise(resolve => setTimeout(resolve, delayWithJitter));
  }

  const message = response.messages[0];
  return message.cctpVersion === 1 ? parseV1Attestation(message) : parseV2Attestation(message);
}

export type CctpAttestation = CctpV1Attestation | CctpV2Attestation;

export type CctpV1Attestation = {
  cctpVersion: 1;
  nonce: bigint;
  sender: Address;
  recipient: Address;
  destinationCaller: Address;
  sourceDomain: keyof EvmDomains;
  targetDomain: keyof EvmDomains;
  messageBody: {
    burnToken: Address;
    mintRecipient: Address;
    amount: string;
    messageSender: Address;
  };
};

function parseV1Attestation(message: v2.ApiResponseMessage): CctpV1Attestation {
  const attestation = deserialize(v1.burnMessageLayout(), message.message);
  return {
    cctpVersion: 1,
    nonce: attestation.nonce,
    sender: toEvmAddress(attestation.sender),
    recipient: toEvmAddress(attestation.recipient),
    destinationCaller: toEvmAddress(attestation.destinationCaller),
    sourceDomain: attestation.sourceDomain as keyof EvmDomains,
    targetDomain: attestation.destinationDomain as keyof EvmDomains,
    messageBody: {
      burnToken: toEvmAddress(attestation.messageBody.burnToken),
      mintRecipient: toEvmAddress(attestation.messageBody.mintRecipient),
      /**
       * @todo: check that this units make sense.
       */
      amount: attestation.messageBody.amount.toString(),
      messageSender: toEvmAddress(attestation.messageBody.messageSender),
    },
  };
};

export type CctpV2Attestation = {
  cctpVersion: 2;
  nonce: Hex; // 32 bytes hex string
  sender: Address;
  recipient: Address;
  destinationCaller: Address;
  sourceDomain: keyof EvmDomains;
  targetDomain: keyof EvmDomains;
  messageBody: {
    burnToken: Address;
    mintRecipient: Address;
    amount: string;
    messageSender: Address;
    maxFee: string;
    feeExecuted?: string;
    expirationBlock: string;
    hookData: string;
  };
  minFinalityThreshold: number;
  finalityThresholdExecuted: number;
};

function parseV2Attestation(message: v2.ApiResponseMessage): CctpV2Attestation {
  const attestation = deserialize(v2.burnMessageLayout(), message.message);
  return {
    cctpVersion: 2,
    nonce: `0x${encoding.hex.encode(attestation.nonce)}`,
    sender: toEvmAddress(attestation.sender),
    recipient: toEvmAddress(attestation.recipient),
    destinationCaller: toEvmAddress(attestation.destinationCaller),
    sourceDomain: attestation.sourceDomain as keyof EvmDomains,
    targetDomain: attestation.destinationDomain as keyof EvmDomains,
    minFinalityThreshold: attestation.minFinalityThreshold,
    finalityThresholdExecuted: attestation.finalityThresholdExecuted,
    messageBody: {
      burnToken: toEvmAddress(attestation.messageBody.burnToken),
      mintRecipient: toEvmAddress(attestation.messageBody.mintRecipient),
      amount: attestation.messageBody.amount.toString(),
      messageSender: toEvmAddress(attestation.messageBody.messageSender),
      maxFee: attestation.messageBody.maxFee.toString(),
      feeExecuted: attestation.messageBody.feeExecuted.toString(),
      expirationBlock: attestation.messageBody.expirationBlock.toString(),
      hookData: encoding.hex.encode(attestation.messageBody.hookData),
    },
  };
};

function toEvmAddress(address: UniversalAddress): Address {
  return address.toPlatformAddress("Evm").toString();
}
