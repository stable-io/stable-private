// Copyright (c) 2025 Stable Technologies Inc
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import type { Url } from "@stable-io/utils";
import type { Duration } from "./constants/index.js";
import { duration } from "./constants/index.js";

const defaultApiOptions = {
  method: "GET",
  headers: { "Content-Type": "application/json" },
};

const defaultCacheTtl = duration(10, "sec");
const apiCache = new Map<Url, { value: unknown; timestamp: number }>();

export const fetchApiResponse = async <T>(
  endpoint: Url,
  ttl: Duration = defaultCacheTtl,
): Promise<T> => {
  const now = Date.now();
  const cached = apiCache.get(endpoint);

  if (cached && now - cached.timestamp <= ttl.toUnit("msec").floor()) {
    return cached.value as T;
  }

  const response = await fetch(endpoint, defaultApiOptions);
  const value = await response.json();
  apiCache.set(endpoint, { value, timestamp: now });
  return value as T;
};
