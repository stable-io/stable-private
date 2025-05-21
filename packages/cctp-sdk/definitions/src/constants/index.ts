// Copyright (c) 2025 Stable Technologies Inc
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import * as apis from "./apis.js";
import type { Network } from "./chains/index.js";
import * as chains from "./chains/index.js";
import * as contracts from "./contracts.js";
import * as kinds from "./kinds.js";
import * as usdcContracts from "./usdc.js";

export * from "./apis.js";
export * from "./chains/index.js";
export * from "./contracts.js";
export * from "./kinds.js";
export * as usdcContracts from "./usdc.js";

export const init = <N extends Network>(network: N) => ({
  ...apis.init(network),
  ...chains.init(network),
  ...contracts,
  ...kinds,
  usdcContracts: usdcContracts.init(network),
} as const);
