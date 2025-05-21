// Copyright (c) 2025 Stable Technologies Inc
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import type { Text } from "./misc.js";
import { definedOrThrow, isUint8Array, throws } from "./misc.js";

describe("throws", () => {
  it("should return false when no error is thrown", () => {
    expect(throws(() => {})).toBe(false);
  });

  it("should return true when an error is thrown", () => {
    expect(
      throws(() => {
        throw new Error("Test error");
      }),
    ).toBe(true);
  });
});

describe("definedOrThrow", () => {
  it("should return the value if defined", () => {
    // eslint-disable-next-line unicorn/no-null
    expect(definedOrThrow(null, "Value is undefined" as Text)).toBe(null);
    expect(definedOrThrow(0, "Value is undefined" as Text)).toBe(0);
    expect(definedOrThrow(false, "Value is undefined" as Text)).toBe(false);
    expect(definedOrThrow("", "Value is undefined" as Text)).toBe("");
  });

  it("should throw an error if the value is undefined", () => {
    expect(() => definedOrThrow(undefined, "Value is undefined" as Text)).toThrow(
      "Value is undefined",
    );
  });
});

describe("isUint8Array", () => {
  it("should return true for Uint8Array", () => {
    expect(isUint8Array(new Uint8Array([1, 2, 3]))).toBe(true);
    expect(isUint8Array(Buffer.from([]))).toBe(true);
  });

  it("should return false for non-Uint8Array values", () => {
    expect(isUint8Array([])).toBe(false);
    expect(isUint8Array({})).toBe(false);
    expect(isUint8Array("string")).toBe(false);
    expect(isUint8Array(123)).toBe(false);
    // eslint-disable-next-line unicorn/no-null
    expect(isUint8Array(null)).toBe(false);
    // eslint-disable-next-line unicorn/no-useless-undefined
    expect(isUint8Array(undefined)).toBe(false);
  });
});
