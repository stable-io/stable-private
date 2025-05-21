// Copyright (c) 2025 Stable Technologies Inc
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import type { Layout, DeriveType } from "binary-layout";
import type { Network } from "@stable-io/cctp-sdk-definitions";
import { byteSwitchLayout, arrayLayout, uint256Item } from "@stable-io/cctp-sdk-definitions";
import { corridorItem, supportedDomainItem, gasDropoffItem } from "./common.js";

const quoteRelayParamsLayout = <N extends Network>(network: N) => [
  { name: "destinationDomain", ...supportedDomainItem(network) },
  { name: "corridor",          ...corridorItem                 },
  { name: "gasDropoff",        ...gasDropoffItem               },
] as const satisfies Layout;

const quoteRelayVariants = <N extends Network>(network: N) => [
  [[0x81, "inUsdc"    ], quoteRelayParamsLayout(network)],
  [[0x82, "inGasToken"], quoteRelayParamsLayout(network)],
] as const;
export const quoteRelayLayout = <N extends Network>(network: N) =>
  byteSwitchLayout("quoteRelay", quoteRelayVariants(network));

export type QuoteRelay<N extends Network> = DeriveType<ReturnType<typeof quoteRelayLayout<N>>>;

export const quoteRelayArrayLayout = <N extends Network>(network: N) =>
  arrayLayout(quoteRelayLayout(network));
export const quoteRelayResultLayout = arrayLayout(uint256Item);
