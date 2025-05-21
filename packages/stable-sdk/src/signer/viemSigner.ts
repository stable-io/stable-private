// Copyright (c) 2025 Stable Technologies Inc
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { Account, createWalletClient, http } from "viem";
import { Chain } from "viem/chains";
import { EvmPlatformSigner } from "../types/signer.js";
import { Url } from "@stable-io/utils";

export class ViemSigner implements EvmPlatformSigner {
  public readonly platform = "Evm" as const;

  constructor(private account: Account) {}

  public getWalletClient(viemChain: Chain, url: Url): ReturnType<typeof createWalletClient> {
    return createWalletClient({
      account: this.account,
      chain: viemChain,
      transport: http(url),
    });
  }
}
