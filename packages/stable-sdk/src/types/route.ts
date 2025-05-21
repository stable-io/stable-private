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
import { Corridor } from "@stable-io/cctp-sdk-cctpr-evm";
import { Intent } from "./intent.js";
import { SupportedPlatform } from "./signer.js";
import { ContractTx, Eip2612Data } from "@stable-io/cctp-sdk-evm";

type StepTypes = "sign-message" | "sign-and-send-transaction";

export type Fee = Usdc | GasTokenOf<keyof EvmDomains>;

interface BaseRouteExecutionStep {
  // id: string; // unique for all steps in a route
  type: StepTypes;
  chain: keyof EvmDomains;
  platform: SupportedPlatform;
  // This is the estimated cost to send the transaction.
  // in this step.
  // Expressed in gas token units
  gasCostEstimation: bigint;
}

export interface SignMessageStep extends BaseRouteExecutionStep {
  type: "sign-message";
  // data: UnsignedMessage; // see existing type on cctp-sdk
}

export interface SignAndSendTxStep extends BaseRouteExecutionStep {
  type: "sign-and-send-transaction";
  // data: UnsignedTx; // see existing type on cctp-sdk
}

export type RouteExecutionStep = SignMessageStep | SignAndSendTxStep;

// TODO: This depends on the network, evm case is ContractTx and UnsignedMessage
type ExecutionStepResult = any;

export type RouteWorkflow = AsyncGenerator<
  RouteExecutionStep,
  void,
  ExecutionStepResult
>;

export interface Route {
  corridor: Corridor;

  estimatedDuration: number; // miliseconds probably

  estimatedTotalCost: Usd;

  fees: Fee[];

  // "rates" property contains information about relevant
  // rates that may have been used in the whole process.
  // The first example we'll need is going to be the gas
  // drop-off exchange rate
  // In the future we may have other rates such as the swap
  // exchange rate once we've incoorporated a swap layer.
  //
  // Type details to be defined by implementer
  // rates: Rates[];

  intent: Intent;

  // the key of message-signature is that it's needed
  // to build transactions and so it needs to be treated
  // in a special way during the whole transfer workflow
  requiresMessageSignature: boolean;

  steps: RouteExecutionStep[];

  /**
   * @todo: review this type.
   */
  workflow: AsyncGenerator<ContractTx | Eip2612Data, ContractTx>;
  // workflow: RouteWorkflow;
}

export function isContractTx(subject: unknown): subject is ContractTx {
  if (typeof subject !== "object" || subject === null) return false;
  return "data" in subject && "to" in subject;
}

export function isEip2612Data(subject: unknown): subject is Eip2612Data {
  if (typeof subject !== "object" || subject === null) return false;
  return "domain" in subject && "types" in subject && "message" in subject;
}

export interface RouteSearchOptions {
  // A single property "paymentToken" will select
  // the token used to pay for all fees.
  // (relayer, gas, gas-dropoff...)
  // Forcing paying all fees with the same coin
  // could limit how many routes are available
  // (not the case for the expected features supported
  // by cctpxr after gas-less payments is working)

  // defaults to usdc.
  paymentToken?: "usdc" | "native";

  // not yet, but likely in the near future
  // slippage: ;

  // whether or not to allow routes
  // that require signing messages as a dependency of a subsequent step
  // think permit, permit2 and the like
  // hopefully this is abstract enough if similar cases
  // appear in other platforms such as Solana, Sui, Aptos...
  // integrators might be interested in filtering out routes
  // that have dependencies between steps since this can make it hard to
  // achieve a "create transactions in a service and send them in another one" architecture.
  // a better name might be allowStepsDependency | restrictStepsDependency
  // allowSigningMessages?: boolean;

  /**
   * @todo:
   * we could easily add a "max relay fee slippage" here to let the integrator
   * configure the slippage we use for the max relay fee.
   */
  // maxRelaySlippage

  // purely for illustration purposes of what kind of
  // other properties this interface may have in the future.
  // allowSwitchingChains: boolean;
}

type IndexNumber = number;

export interface RoutesResult {
  all: Route[];
  fastest: IndexNumber;
  cheapest: IndexNumber;
}

export type TransferOptions = RouteSearchOptions & {
  strategy: "cheapest" | "fastest";
};
