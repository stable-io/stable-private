// Copyright (c) 2025 Stable Technologies Inc
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import type { Text } from "./misc.js";
import { assertDistinct, assertEqual } from "./assertions.js";

describe("assertDistinct", () => {
  it("should throw an error if values are NOT distinct", () => {
    expect(() => assertDistinct(1, 2, 3, 1)).toThrow();
  });

  it("should NOT throw an error if values are distinct (references)", () => {
    expect(() => assertDistinct({}, {}, {})).not.toThrow();
    expect(assertDistinct(1, 2, 3)).toBeUndefined();
  });
});

describe("assertEqual", () => {
  it("should throw an error if values are NOT equal (shallow)", () => {
    expect(() => assertEqual(1, 2)).toThrow();
    expect(() => assertEqual({}, {})).toThrow();
  });

  it("should throw an error with a custom message", () => {
    expect(() => assertEqual(1, 2, "custom" as Text)).toThrow("custom");
  });

  it("should NOT throw an error if values are equal (shallow)", () => {
    const ref = {};
    expect(() => assertEqual(ref, ref)).not.toThrow();
    expect(assertEqual(1, 1)).toBeUndefined();
  });
});
