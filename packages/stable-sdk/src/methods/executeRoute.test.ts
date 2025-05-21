// Copyright (c) 2025 Stable Technologies Inc
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { $executeRoute } from "./executeRoute.js";

describe.skip("$executeRoute", () => {
  let executeRoute: ReturnType<typeof $executeRoute>;

  beforeEach(() => {
    executeRoute = $executeRoute({
      getSigners: () => [],
      EvmClient: {} as any,
      cctpSdk: {} as any,
    } as any);
  });

  /** @todo write real tests */
  it("should get routes", () => {
    expect(executeRoute(undefined as any)).toEqual(expect.anything());
  });
});
