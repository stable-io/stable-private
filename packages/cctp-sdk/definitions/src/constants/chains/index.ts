// Copyright (c) 2025 Stable Technologies Inc
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import * as chainIds from "./chainIds.js";
import * as domains from "./domains.js";
import type { Network } from "./networks.js";
import * as networks from "./networks.js";
import * as platforms from "./platforms.js";

export * from "./chainIds.js";
export * from "./domains.js";
export * from "./networks.js";
export * from "./platforms.js";

export const init = <N extends Network>(network: N) => ({
  ...networks,
  ...domains,
  ...platforms,
  ...chainIds.init(network),
} as const);
