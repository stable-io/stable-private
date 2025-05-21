// Copyright (c) 2025 Stable Technologies Inc
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { EvmAddress } from "./address.js";
import {
  abiEncodedBytesItem,
  evmAddressItem,
  selectorOf,
} from "./layoutItems.js";

describe("layoutItems", () => {
  describe("selectorOf", () => {
    it("should convert selector to bytes", () => {
      const selector = selectorOf("transfer(address,uint256)");
      expect(Buffer.from(selector).toString("hex")).toBe("a9059cbb");
    });
  });

  describe("abiEncodedBytesItem", () => {
    it("should convert wrapped bytes to bytes", () => {
      const data = "deadbeef";
      const testBytes = Uint8Array.from(Buffer.from(data, "hex"));
      const wrapped = { item: testBytes };
      const bytes = abiEncodedBytesItem().custom.to(wrapped);
      expect(bytes).toBeInstanceOf(Uint8Array);
      expect(Buffer.from(bytes).toString("hex")).toBe(data);
    });

    it("should convert bytes to wrapped bytes", () => {
      const data = "deadbeef";
      const testBytes = Uint8Array.from(Buffer.from(data, "hex"));
      const wrapped = abiEncodedBytesItem().custom.from(testBytes);
      expect(wrapped.item).toBeInstanceOf(Uint8Array);
      expect(Buffer.from(wrapped.item).toString("hex")).toBe(data);
    });
  });

  describe("evmAddressItem", () => {
    it("should convert Uint8Array to EvmAddress", () => {
      const hexData = "0000000000000000000000000000000000000001";
      const bytes = Buffer.from(hexData, "hex");
      const address = evmAddressItem.custom.to(bytes);
      expect(address).toBeInstanceOf(EvmAddress);
      expect(address.toString()).toBe(`0x${hexData}`);
    });

    it("should convert EvmAddress to Uint8Array", () => {
      const hexData = "0000000000000000000000000000000000000001";
      const address = new EvmAddress(`0x${hexData}`);
      const bytes = evmAddressItem.custom.from(address);
      expect(bytes).toBeInstanceOf(Uint8Array);
      expect(Buffer.from(bytes).toString("hex")).toBe(hexData);
    });
  });
});
