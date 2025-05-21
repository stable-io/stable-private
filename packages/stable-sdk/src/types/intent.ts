// Copyright (c) 2025 Stable Technologies Inc
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { EvmDomains } from "@stable-io/cctp-sdk-definitions";
import { Address, Amount } from "./general.js";
export interface IntentBase {
  sourceChain: keyof EvmDomains;
  /**
   * @todo: target should also support Solana.
   */
  targetChain: keyof EvmDomains;
  amount: Amount;
  gasDropoffDesired?: bigint;
}

export interface Intent extends IntentBase {
  sender: Address;
  recipient: Address;
  relayFeeMaxChangeMargin?: number;
}
