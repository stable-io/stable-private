// Copyright (c) 2025 Stable Technologies Inc
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { stripPrefix, hex, base58, base64, bignum, bytes } from "./encoding.js";
import type { Size } from "./misc.js";

describe("stripPrefix", () => {
  it("should strip prefix", () => {
    expect(stripPrefix("0x", "0x1234")).toBe("1234");
    expect(stripPrefix("0x", "12340x")).toBe("12340x");
    expect(stripPrefix("0x", "120x34")).toBe("120x34");
    expect(stripPrefix("0x", "0x")).toBe("");
  });
});

describe("hex", () => {
  it("should validate", () => {
    expect(hex.isValid("0x1234")).toBe(true);
    expect(hex.isValid("1234")).toBe(true);
    expect(hex.isValid("0xGHIJ")).toBe(false);
    expect(hex.isValid("GHIJ")).toBe(false);
  });

  it("should decode", () => {
    expect(hex.decode("0x48656c6c6f20576f726c6421")).toEqual(
      new Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33]),
    );
    expect(hex.decode("48656c6c6f20576f726c6421")).toEqual(
      new Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33]),
    );
  });

  it("should encode from Uint8Array", () => {
    expect(
      hex.encode(
        new Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33]),
      ),
    ).toEqual("48656c6c6f20576f726c6421");
    expect(
      hex.encode(
        new Uint8Array([
          72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33,
        ]),
        true,
      ),
    ).toEqual("0x48656c6c6f20576f726c6421");
  });

  it("should encode from string", () => {
    expect(hex.encode("test")).toEqual("74657374");
    expect(hex.encode("test", true)).toEqual("0x74657374");
  });
});

describe("base58", () => {
  it("should encode", () => {
    expect(base58.encode("test")).toEqual("3yZe7d");
    expect(base58.encode(new Uint8Array([72, 101, 108, 108, 111]))).toEqual(
      "9Ajdvzr",
    );
  });
});

describe("base64", () => {
  it("should validate", () => {
    expect(base64.isValid("dGVzdA==")).toBe(true);
    expect(base64.isValid("dGVzdA")).toBe(false);
    expect(base64.isValid("dGVzdA===")).toBe(false);
  });

  it("should encode", () => {
    expect(base64.encode("test")).toEqual("dGVzdA==");
    expect(base64.encode(new Uint8Array([72, 101, 108, 108, 111]))).toEqual(
      "SGVsbG8=",
    );
  });
});

describe("bignum", () => {
  it("should decode", () => {
    expect(bignum.decode("0x1234")).toEqual(4660n);
    expect(bignum.decode(new Uint8Array([0x12, 0x34]))).toEqual(4660n);
    expect(bignum.decode("0x", true)).toEqual(0n);
    expect(bignum.decode("", true)).toEqual(0n);
    expect(() => bignum.decode("0x")).toThrow();
    expect(() => bignum.decode("")).toThrow();
  });

  it("should encode", () => {
    expect(bignum.encode(4660n)).toEqual("1234");
    expect(bignum.encode(4660n, true)).toEqual("0x1234");
  });

  it("should convert to string", () => {
    expect(bignum.toString(4660n)).toEqual("1234");
    expect(bignum.toString(4660n, true)).toEqual("0x1234");
    expect(bignum.toString(1n)).toEqual("01");
  });

  it("should convert to bytes", () => {
    expect(bignum.toBytes(4660n)).toEqual(new Uint8Array([0x12, 0x34]));
    expect(bignum.toBytes(4660)).toEqual(new Uint8Array([0x12, 0x34]));
    expect(bignum.toBytes(4660n, 4 as Size)).toEqual(
      new Uint8Array([0x00, 0x00, 0x12, 0x34]),
    );
    expect(() => bignum.toBytes(4660n, 1 as Size)).toThrow();
  });

  it("should convert to number", () => {
    expect(bignum.toNumber(4660n)).toEqual(4660);
    expect(() =>
      bignum.toNumber(BigInt(Number.MAX_SAFE_INTEGER + 1)),
    ).toThrow();
    expect(() =>
      bignum.toNumber(BigInt(Number.MIN_SAFE_INTEGER - 1)),
    ).toThrow();
  });

  it("should convert to bigint", () => {
    expect(bignum.toBigInt(4660)).toEqual(4660n);
    expect(() => bignum.toBigInt(Number.MIN_SAFE_INTEGER - 1)).toThrow();
    expect(() => bignum.toBigInt(Number.MAX_SAFE_INTEGER + 1)).toThrow();
  });
});

describe("bytes", () => {
  it("should decode", () => {
    expect(bytes.decode(new Uint8Array([116, 101, 115, 116]))).toEqual("test");
  });

  it("should encode", () => {
    expect(bytes.encode("test")).toEqual(new Uint8Array([116, 101, 115, 116]));
  });

  it("should check equality", () => {
    expect(
      bytes.equals(new Uint8Array([1, 2, 3]), new Uint8Array([1, 2, 3])),
    ).toBe(true);
    expect(
      bytes.equals(new Uint8Array([1, 2, 3]), new Uint8Array([1, 2])),
    ).toBe(false);
  });

  it("should zero pad", () => {
    expect(bytes.zpad(new Uint8Array([1, 2, 3]), 5 as Size)).toEqual(
      new Uint8Array([0, 0, 1, 2, 3]),
    );
    expect(bytes.zpad(new Uint8Array([1, 2, 3]), 3 as Size)).toEqual(
      new Uint8Array([1, 2, 3]),
    );
    expect(bytes.zpad(new Uint8Array([1]), 2 as Size, false)).toEqual(
      new Uint8Array([1, 0]),
    );
    expect(() => bytes.zpad(new Uint8Array([1, 2, 3]), 2 as Size)).toThrow();
  });

  it("should concat", () => {
    expect(
      bytes.concat(new Uint8Array([1, 2]), new Uint8Array([3, 4])),
    ).toEqual(new Uint8Array([1, 2, 3, 4]));
  });
});
