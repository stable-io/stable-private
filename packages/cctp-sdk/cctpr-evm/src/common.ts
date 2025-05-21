// Copyright (c) 2025 Stable Technologies Inc
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import type { Network, DomainsOf } from "@stable-io/cctp-sdk-definitions";
import type { SupportedDomain } from "@stable-io/cctp-sdk-cctpr-definitions";

export type SupportedEvmDomain<N extends Network> = SupportedDomain<N> & DomainsOf<"Evm">;
