// Copyright (c) 2025 Stable Technologies Inc
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { createWalletClient } from "viem";
import { EvmDomains } from "@stable-io/cctp-sdk-definitions";
import { Address, Amount, Chain, Network, TxHash } from "./general.js";
import { Intent } from "./intent.js";
import { Route } from "./route.js";
import { EvmPlatformSigner } from "./signer.js";
import { Url } from "@stable-io/utils";
import { Redeem } from "./redeem.js";
import { CctpAttestation } from "src/methods/executeRoute/findTransferAttestation.js";

export interface SDKOptions<N extends Network> {
  network: N;
  signer: EvmPlatformSigner;
  rpcUrls?: Partial<Record<keyof EvmDomains, string>>;
}

export abstract class SDK<N extends Network> {
  constructor(protected options: SDKOptions<N>) {}

  public abstract getNetwork(): N;

  public abstract findRoutes(
    intent: Intent,
    routeSearchOptions: RouteSearchOptions,
  ): Promise<RoutesResult>;

  public abstract checkHasEnoughFunds(route: Route): Promise<boolean>;

  public abstract executeRoute(route: Route): Promise<{
    transactions: TxHash[];
    attestations: CctpAttestation[];
    redeems: Redeem[];
    transferHash: TxHash;
    redeemHash: TxHash;
  }>;

  public abstract getBalance(
    address: Address,
    chains: (keyof EvmDomains)[],
  ): Promise<Record<keyof EvmDomains, Amount>>;

  public abstract setSigner(signer: SDKOptions<N>["signer"]): void;

  public abstract getSigner(
    chain: keyof EvmDomains
  ): ViemWalletClient;

  public abstract getRpcUrl(domain: keyof EvmDomains): Url;
}

export type ViemWalletClient = ReturnType<typeof createWalletClient>;

export interface RoutesResult {
  all: Route[];
  fastest: number;
  cheapest: number;
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
