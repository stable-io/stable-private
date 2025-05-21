// Copyright (c) 2025 Stable Technologies Inc
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import type { Text } from "./misc.js";

export const assertDistinct = <T>(...values: T[]) => {
  const uniqueValues = new Set(values);
  if (uniqueValues.size !== values.length) {
    throw new Error(`Values are not distinct: ${values.join(", ")}`);
  }
};

export const assertEqual = <T>(
  a: T,
  b: T,
  message: Text = `Expected ${a} to equal ${b}` as Text,
) => {
  if (a !== b) {
    throw new Error(message);
  }
};
