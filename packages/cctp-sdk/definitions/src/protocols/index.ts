// Copyright (c) 2025 Stable Technologies Inc
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import type { Network } from "../constants/index.js";
import * as v1 from "./v1/index.js";
import * as v2 from "./v2/index.js";

export * as v1 from "./v1/index.js";
export * as v2 from "./v2/index.js";

export const init = <N extends Network>(network: N) => ({
  v1: v1.init(network),
  v2: v2.init(network),
} as const);
