// Copyright (c) 2025 Stable Technologies Inc
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { StableSDK } from "./stable.js";
import { PlatformSigner } from "./types/index.js";

describe("StableSDK", () => {
  it.todo("should test");
  // let stable: StableSDK;
  // beforeEach(() => {
  //   stable = new StableSDK({
  //     network: "Testnet",
  //     evmClient: {} as any,
  //     signers: [],
  //   });
  // });

  // it("should re-set signers", () => {
  //   const signer_1: PlatformSigner = {
  //     platform: "Evm",
  //     getWalletClient: jest.fn(),
  //     switchChain: jest.fn(),
  //   };
  //   const signer_2: PlatformSigner = {
  //     platform: "Evm",
  //     getWalletClient: jest.fn(),
  //     switchChain: jest.fn(),
  //   };

  //   stable = new StableSDK({
  //     network: "Testnet",
  //     evmClient: {} as any,
  //     signers: [signer_1],
  //   });
  //   expect((stable as any).options.signers[0]).toBe(signer_1);
  //   expect((stable as any).options.signers).toHaveLength(1);

  //   stable.setSigners([signer_1, signer_2]);
  //   expect((stable as any).options.signers[0]).toBe(signer_1);
  //   expect((stable as any).options.signers[1]).toBe(signer_2);
  //   expect((stable as any).options.signers).toHaveLength(2);

  //   stable.setSigners([signer_2]);
  //   expect((stable as any).options.signers[0]).toBe(signer_2);
  //   expect((stable as any).options.signers).toHaveLength(1);
  // });
});
