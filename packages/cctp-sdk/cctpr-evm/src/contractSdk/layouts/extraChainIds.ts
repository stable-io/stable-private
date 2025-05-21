// Copyright (c) 2025 Stable Technologies Inc
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import type { Item } from "binary-layout";
import type { RoArray } from "@stable-io/map-utils";
import { paddedSlotItem } from "@stable-io/cctp-sdk-evm";

//same reason for inverting as for feeAdjustments
const reverseChainIds = (ci: RoArray<number>) => ci.toReversed();

//only 12 chainIds per slot for uniform handling of 12 baked-in chainIds
export const chainIdsPerSlot = 12;

export const chainIdsSlotItem = {
  binary: "bytes",
  layout: paddedSlotItem({
    binary: "array",
    length: chainIdsPerSlot,
    layout: { binary: "uint", size: 2 },
  }),
  custom: { to: reverseChainIds, from: reverseChainIds },
 } as const satisfies Item;
