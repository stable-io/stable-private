// Copyright (c) 2025 Stable Technologies Inc
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import type { Network } from "../../constants/index.js";
import * as constants from "./constants.js";
import * as messages from "./messages.js";

export * from "./constants.js";
export * from "./messages.js";

export const init = <N extends Network>(network: N) => ({
  ...constants.init(network),
  ...messages,
} as const);
