// Copyright (c) 2025 Stable Technologies Inc
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { $findRoutes } from "./findRoutes.js";

describe.skip("$findRoutes", () => {
  let findRoutes: ReturnType<typeof $findRoutes>;

  beforeEach(() => {
    findRoutes = $findRoutes({} as any);
  });

  /** @todo write real tests */
  it("should get routes", () => {
    expect(findRoutes(undefined as any, undefined as any)).toEqual(expect.anything());
  });
});
