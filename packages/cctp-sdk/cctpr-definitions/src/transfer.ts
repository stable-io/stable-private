// Copyright (c) 2025 Stable Technologies Inc
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import type { SupportedDomain } from "./constants.js";
import type {
  Usdc,
  GasTokenOf,
  Duration,
  Network,
  Percentage,
} from "@stable-io/cctp-sdk-definitions";

type CorridorStats<N extends Network, D extends SupportedDomain<N>> = {
  cost: { relay: [usdcCost: Usdc, gasCost: GasTokenOf<D>]; fast?: Percentage };
  transferTime: Duration;
};

export const getCorridors = <N extends Network>(network: N) => async function<
  S extends SupportedDomain<N>,
  D extends SupportedDomain<N>,
  //... provider<S>,
  //... circleApi
>(
  sourceDomain: S,
  destinationDomain: D,
  gasDropoff?: GasTokenOf<D>,
): Promise<CorridorStats<N, S>[]> {
  //overloaded: requires amount but only if S is a v2 chain (and not Avalanche)
  //TODO impl
  //check if gas dropoff is supported and below max
  return await Promise.resolve([]);
};

// export async function* transfer<
//   const S extends SupportedDomain,
//   const D extends SupportedDomain,
//   //... provider<S>,
// >(sourceDomain: S, destinationDomain: D, amount: number):
// Promise<AsyncGenerator<WalletInteractionPrepper<PlatformOf<S>>>> {
//   yield 1;
// }
