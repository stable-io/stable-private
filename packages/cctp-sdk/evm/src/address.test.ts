// Copyright (c) 2025 Stable Technologies Inc
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { UniversalAddress } from "@stable-io/cctp-sdk-definitions";
import { EvmAddress } from "./address.js";

describe("EvmAddress", () => {
  describe("isValidAddress", () => {
    it("should return true for valid addresses", () => {
      expect(EvmAddress.isValidAddress("0x742d35Cc6634C0532925a3b844Bc454e4438f44e")).toBe(true);
      expect(EvmAddress.isValidAddress("0x0000000000000000000000000000000000000000")).toBe(true);
    });

    it("should return false for invalid addresses", () => {
      expect(EvmAddress.isValidAddress("0x123")).toBe(false);
      expect(EvmAddress.isValidAddress("not an address")).toBe(false);
      expect(EvmAddress.isValidAddress("0x742d35Cc6634C0532925a3b844Bc454e4438f44")).toBe(false);
    });
  });

  describe("constructor", () => {
    describe("string input", () => {
      it("should create address from valid hex string", () => {
        const address = new EvmAddress("0x742d35Cc6634C0532925a3b844Bc454e4438f44e");
        expect(address.toString()).toBe("0x742d35Cc6634C0532925a3b844Bc454e4438f44e");
      });

      it("should throw for invalid hex string", () => {
        const message = /expected 20-byte hex string/iu;
        expect(() => new EvmAddress("0x123")).toThrow(message);
        expect(() => new EvmAddress("not an address")).toThrow(message);
      });

      it("should normalize address to checksum format", () => {
        const address = new EvmAddress("0x742d35cc6634c0532925a3b844bc454e4438f44e");
        expect(address.toString()).toBe("0x742d35Cc6634C0532925a3b844Bc454e4438f44e");
      });
    });

    describe("Uint8Array input", () => {
      it("should create address from valid byte array", () => {
        const bytes = new Uint8Array(20).fill(0);
        bytes[19] = 1;
        const address = new EvmAddress(bytes);
        expect(address.toString()).toBe("0x0000000000000000000000000000000000000001");
      });

      it("should throw for incorrect byte length", () => {
        const message = /expected 20 bytes/iu;
        expect(() => new EvmAddress(new Uint8Array(19))).toThrow(message);
        expect(() => new EvmAddress(new Uint8Array(21))).toThrow(message);
      });
    });

    describe("UniversalAddress input", () => {
      it("should create address from valid UniversalAddress", () => {
        const universalAddress = new UniversalAddress(
          "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
          "Evm",
        );
        const address = new EvmAddress(universalAddress);
        expect(address.toString()).toBe("0x742d35Cc6634C0532925a3b844Bc454e4438f44e");
      });

      it("should throw for non-Evm UniversalAddress", () => {
        const universalAddress = new UniversalAddress(
          "0x010000000000000000000000742d35Cc6634C0532925a3b844Bc454e4438f44e",
        );
        const message = /prefix is not zero/iu;
        expect(() => new EvmAddress(universalAddress)).toThrow(message);
      });
    });

    describe("EvmAddress input", () => {
      it("should create copy of existing EvmAddress", () => {
        const original = new EvmAddress("0x742d35Cc6634C0532925a3b844Bc454e4438f44e");
        const copy = new EvmAddress(original);
        expect(copy.toString()).toBe(original.toString());
        expect(copy).not.toBe(original);
      });
    });
  });

  describe("unwrap", () => {
    it("should return checksum address string", () => {
      const address = new EvmAddress("0x742d35cc6634c0532925a3b844bc454e4438f44e");
      expect(address.unwrap()).toBe("0x742d35Cc6634C0532925a3b844Bc454e4438f44e");
    });
  });

  describe("toString", () => {
    it("should return checksum address string", () => {
      const address = new EvmAddress("0x742d35cc6634c0532925a3b844bc454e4438f44e");
      expect(address.toString()).toBe("0x742d35Cc6634C0532925a3b844Bc454e4438f44e");
    });
  });

  describe("toUint8Array", () => {
    it("should return correct byte array", () => {
      const address = new EvmAddress("0x0000000000000000000000000000000000000001");
      const bytes = address.toUint8Array();
      expect(bytes.length).toBe(20);
      expect(bytes[19]).toBe(1);
      expect(bytes.slice(0, 19).every(byte => byte === 0)).toBe(true);
    });
  });

  describe("toUniversalAddress", () => {
    it("should create UniversalAddress with correct bytes", () => {
      const address = new EvmAddress("0x742d35Cc6634C0532925a3b844Bc454e4438f44e");
      const universalAddress = address.toUniversalAddress();
      expect(universalAddress.toString()).toBe(
        "0x000000000000000000000000742d35cc6634c0532925a3b844bc454e4438f44e",
      );
    });
  });
});
