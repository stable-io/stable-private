// Copyright (c) 2025 Stable Technologies Inc
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { deserialize } from "binary-layout";
import { Hex } from "viem";
import { EvmDomains, UniversalAddress, v1, v2 } from "@stable-io/cctp-sdk-definitions";
import type { Address, Network, TxHash } from "../../types/index.js";
import { encoding } from "@stable-io/utils";

export async function findTransferAttestation<N extends Network>(
  network: N,
  sourceChain: keyof EvmDomains,
  transactionHash: TxHash,
): Promise<Attestation> {
  let response: v2.GetMessagesResponse;
  while (true) {
    response = await v2.fetchMessagesFactory(network)(
      sourceChain,
      { transactionHash },
    );

    if (response.status === "success") {
      break;
    }
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  const message = response.messages[0];

  return message.cctpVersion === 1 ? parseV1Attestation(message) : parseV2Attestation(message);
}

export type Attestation = V1Attestation | V2Attestation;

export type V1Attestation = {
  cctpVersion: 1;
  nonce: bigint;
  sender: Address;
  recipient: Address;
  destinationCaller: Address;
  sourceChain: keyof EvmDomains;
  targetChain: keyof EvmDomains;
  messageBody: {
    burnToken: Address;
    mintRecipient: Address;
    amount: string;
    messageSender: Address;
  };
};

function parseV1Attestation(message: v2.ApiResponseMessage): V1Attestation {
  const attestation = deserialize(v1.burnMessageLayout(), message.message);
  return {
    cctpVersion: 1,
    nonce: attestation.nonce,
    sender: toEvmAddress(attestation.sender),
    recipient: toEvmAddress(attestation.recipient),
    destinationCaller: toEvmAddress(attestation.destinationCaller),
    sourceChain: attestation.sourceDomain as keyof EvmDomains,
    targetChain: attestation.destinationDomain as keyof EvmDomains,
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

export type V2Attestation = {
  cctpVersion: 2;
  nonce: Hex; // 32 bytes hex string
  sender: Address;
  recipient: Address;
  destinationCaller: Address;
  sourceChain: keyof EvmDomains;
  targetChain: keyof EvmDomains;
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

function parseV2Attestation(message: v2.ApiResponseMessage): V2Attestation {
  const attestation = deserialize(v2.burnMessageLayout(), message.message);
  return {
    cctpVersion: 2,
    nonce: `0x${encoding.hex.encode(attestation.nonce)}`,
    sender: toEvmAddress(attestation.sender),
    recipient: toEvmAddress(attestation.recipient),
    destinationCaller: toEvmAddress(attestation.destinationCaller),
    sourceChain: attestation.sourceDomain as keyof EvmDomains,
    targetChain: attestation.destinationDomain as keyof EvmDomains,
    minFinalityThreshold: attestation.minFinalityThreshold,
    finalityThresholdExecuted: attestation.finalityThresholdExecuted,
    messageBody: {
      burnToken: toEvmAddress(attestation.messageBody.burnToken),
      mintRecipient: toEvmAddress(attestation.messageBody.mintRecipient),
      amount: attestation.messageBody.amount.toString(),
      messageSender: toEvmAddress(attestation.messageBody.messageSender),
      maxFee: attestation.messageBody.maxFee.toString(),
      feeExecuted: attestation.messageBody.feeExecuted?.toString(),
      expirationBlock: attestation.messageBody.expirationBlock.toString(),
      hookData: encoding.hex.encode(attestation.messageBody.hookData),
    },
  };
};

function toEvmAddress(address: UniversalAddress): Address {
  return address.toPlatformAddress("Evm").toString();
}