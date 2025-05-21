// Copyright (c) 2025 Stable Technologies Inc
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import type { ApiVersion, Domain, Network, Usdc, Duration, Percentage } from "../../constants/index.js";
import { usdc, domainIdOf, percentage } from "../../constants/index.js";
import { apiEndpoint } from "../../constants/apis.js";
import { fetchApiResponse } from "../../api.js";

type FastBurnAllowanceRawResponse = Readonly<{
  allowance: number;
  lastUpdated: string;
}>;

export type FastBurnAllowanceResponse = Readonly<{
  allowance: Usdc;
  lastUpdated: Date;
}>;

type FastBurnFeeRawResponse = Readonly<{ minimumFee: number }>;

export type FastBurnFeeResponse = Readonly<{ minimumFee: Percentage }>;

export const fetchFastBurnAllowanceFactory = <N extends Network>(network: N) => async (
  ttl?: Duration,
): Promise<FastBurnAllowanceResponse> => {
  const endpoint = apiEndpoint(network)(2 as ApiVersion, "fastBurn", "USDC", "allowance");
  const response = await fetchApiResponse<FastBurnAllowanceRawResponse>(endpoint, ttl);
  return {
    allowance: usdc(response.allowance),
    lastUpdated: new Date(response.lastUpdated),
  };
};

export const fetchFastBurnFeeFactory = <N extends Network>(network: N) => async (
  sourceDomain: Domain,
  destinationDomain: Domain,
  ttl?: Duration,
): Promise<FastBurnFeeResponse> => {
  const sourceDomainId = domainIdOf(sourceDomain);
  const destinationDomainId = domainIdOf(destinationDomain);
  const endpoint = apiEndpoint(network)(
    2 as ApiVersion,
    "fastBurn",
    "USDC",
    "fees",
    sourceDomainId.toString(10),
    destinationDomainId.toString(10),
  );
  const response = await fetchApiResponse<FastBurnFeeRawResponse>(endpoint, ttl);
  return { minimumFee: percentage(response.minimumFee, "bp") };
};

export const init = <N extends Network>(network: N) => ({
  fetchFastBurnAllowance: fetchFastBurnAllowanceFactory(network),
  fetchFastBurnFee: fetchFastBurnFeeFactory(network),
} as const);
