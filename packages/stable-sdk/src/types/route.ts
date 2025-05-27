// Copyright (c) 2025 Stable Technologies Inc
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import {
  Usdc,
  Usd,
  EvmDomains,
  GasTokenOf,
} from "@stable-io/cctp-sdk-definitions";
import { Permit } from "@stable-io/cctp-sdk-evm";
import { Corridor } from "@stable-io/cctp-sdk-cctpr-evm";
import { Intent } from "./intent.js";
import { SupportedPlatform } from "./signer.js";
import { ContractTx, Eip2612Data } from "@stable-io/cctp-sdk-evm";
import { TransferProgressEventEmitter } from "src/progress.js";

type StepTypes = "permit" | "pre-approval" | "transfer";

export type Fee = Usdc | GasTokenOf<keyof EvmDomains>;


export interface Route {
  corridor: Corridor;

  estimatedDuration: number; // miliseconds probably

  estimatedTotalCost: Usd;

  fees: Fee[];

  // "rates" property will contain information about relevant
  // rates that may have been used in the whole process.
  // The first example we'll need is going to be the gas
  // drop-off exchange rate
  // In the future we may have other rates such as the swap
  // exchange rate once we've incoorporated a swap layer.
  //
  // Type details to be defined by implementer
  // rates: Rates[];

  intent: Intent;

  // When using permit, the transactions require a an Eip2612
  // signature to be built, so they can not be built eagerly.
  // This is the reason behind workflow needing to be an async
  // generator or state machine, which is not serializable.
  // There are some scenarios where integrator may want to
  // prevent using this routes to generate a serializable workflow.
  // (eg: txs generated in the backend and signed on the front-end)
  requiresMessageSignature: boolean;

  steps: RouteExecutionStep[];

  progress: TransferProgressEventEmitter;
  workflow: AsyncGenerator<ContractTx | Eip2612Data, ContractTx, Permit | undefined>;
}

interface BaseRouteExecutionStep {
  type: StepTypes;
  chain: keyof EvmDomains;
  platform: SupportedPlatform;
  // This is the estimated cost of executing this step on-chain.
  // value=0 for permits
  // Expressed in gas token units
  gasCostEstimation: bigint;
};

export type RouteExecutionStep = SignPermitStep | PreApproveStep | TransferStep;

export interface SignPermitStep extends BaseRouteExecutionStep {
  type: "permit";
};

export interface PreApproveStep extends BaseRouteExecutionStep {
  type: "pre-approval";
};

export interface TransferStep extends BaseRouteExecutionStep {
  type: "transfer"
};

/**
 * 
 * @param txOrSig at the moment cctp-sdk returns either a contract transaction to sign and send
 *                or a eip2612 message to sign and return to it.
 */
export function getStepType(txOrSig: ContractTx | Eip2612Data): StepTypes {
  if (isEip2612Data(txOrSig)) return "permit";
  if (isContractTx(txOrSig) && isApprovalTx(txOrSig)) return "pre-approval";
  if (isContractTx(txOrSig) && isTransferTx(txOrSig)) return "transfer";
  throw new Error("Unknown Step Type");
};

export function isContractTx(subject: unknown): subject is ContractTx {
  if (typeof subject !== "object" || subject === null) return false;
  return "data" in subject && "to" in subject;
}

export function isEip2612Data(subject: unknown): subject is Eip2612Data {
  if (typeof subject !== "object" || subject === null) return false;
  return "domain" in subject && "types" in subject && "message" in subject;
}

export function isApprovalTx(subject: ContractTx): boolean {
  throw new Error("Not Implemented");
}

export function isTransferTx(subject: ContractTx): boolean {
  throw new Error("Not Implemented");
}

export type PaymentTokenOptions = "usdc" | "native";

export interface RouteSearchOptions {
  // A single property "paymentToken" will select
  // the token used to pay for all fees.
  // (relayer, gas, gas-dropoff...)

  // defaults to usdc.
  paymentToken?: PaymentTokenOptions;

  // How much change in the relay fee is tolerated between the moment the
  // relay is quoted until the relay is executed.
  relayFeeMaxChangeMargin?: number;

  // Ideas...
  // allowSigningMessages?: boolean;
  // allowSwitchingChains: boolean;
}

type IndexNumber = number;

export interface RoutesResult {
  all: Route[];
  fastest: IndexNumber;
  cheapest: IndexNumber;
}
