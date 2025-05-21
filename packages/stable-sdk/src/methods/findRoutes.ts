// Copyright (c) 2025 Stable Technologies Inc
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { Amount, Conversion } from "@stable-io/amount";
import type { SupportedDomain } from "@stable-io/cctp-sdk-cctpr-definitions";
import { init as initCctpr } from "@stable-io/cctp-sdk-cctpr-definitions";
import type {
  Corridor,
  CorridorStats,
  SupportedEvmDomain,
} from "@stable-io/cctp-sdk-cctpr-evm";
import {
  init as initCctprEvm,
} from "@stable-io/cctp-sdk-cctpr-evm";
import {
  init as initDefinitions,
  EvmDomains,
  GasTokenKindOf,
  GasTokenNameOf,
  GasTokenOf,
  Usdc,
  usdc,
  usd,
  Usd,
  gasTokenKindOf,
  gasTokenNameOf,
  gasTokenOf,
} from "@stable-io/cctp-sdk-definitions";
import { EvmAddress, init as initEvm } from "@stable-io/cctp-sdk-evm";
import { ViemEvmClient } from "@stable-io/cctp-sdk-viem";
import { TODO } from "@stable-io/utils";
import type {
  Fee,
  SDK,
  Route,
  RouteExecutionStep,
  Network,
  Intent,
} from "../types/index.js";

/**
 * @todo: no need to use bigint for gas units
 */
const EVM_APPROVAL_TX_GAS_COST_APROXIMATE = 40000n;
const RELAY_FEE_MAX_CHANGE_MARGIN = 1.5;

export type FindRoutesDeps<N extends Network> = Pick<SDK<N>, "getNetwork" | "getRpcUrl">;

export const $findRoutes =
  <N extends Network>({
    getNetwork,
    getRpcUrl,
  }: FindRoutesDeps<N>): SDK<N>["findRoutes"] =>
  async (intent, routeSearchOptions) => {
    const paymentToken = routeSearchOptions.paymentToken ?? "usdc";

    const network = getNetwork();
    const rpcUrl = getRpcUrl(intent.sourceChain);
    const cctprEvm = initCctprEvm(network);

    const viemEvmClient = ViemEvmClient.fromNetworkAndDomain(
      network,
      intent.sourceChain,
      rpcUrl,
    );

    const gasDropoff = Amount.ofKind(gasTokenKindOf(intent.targetChain))(
      intent.gasDropoffDesired ?? 0,
      "atomic",
    ) as GasTokenOf<SupportedDomain<N>>;

    const { stats: corridorStats, fastBurnAllowance } =
      await cctprEvm.getCorridors(viemEvmClient, intent.targetChain, gasDropoff as TODO);

    const routes: Route[] = [];
    let fastest = -1;
    let cheapest = -1;
    for (const corridor of corridorStats) {
      if (corridor.cost.fast !== undefined && /**
         * The corridor is fast. We need to double check that the transfer amount
         * doesn't exceed the current fastBurnAllowance
         */
        usdc(intent.amount).ge(fastBurnAllowance)) {
          continue;
        }

      const newRoutes = await buildCorridorRoutes(
        viemEvmClient,
        intent,
        corridor,
        gasDropoff,
        paymentToken === "usdc",
      );
      for (const newRoute of newRoutes) {
        const index = routes.length;
        if (
          fastest === -1 ||
          newRoute.estimatedDuration < routes[fastest].estimatedDuration
        ) {
          fastest = index;
        }
        if (
          cheapest === -1 ||
          newRoute.estimatedTotalCost.lt(routes[cheapest].estimatedTotalCost)
        ) {
          cheapest = index;
        }

        routes.push(newRoute);
      }
    }

    return {
      all: routes,
      fastest,
      cheapest,
    };
  };

/**
 * Many different routes could be built for a given corridor.
 * Of course, some of them don't really make sense.
 *
 * Eg:
 * Ethereum -> Solana could give place to all this options:
 *  - Ethereum -> Solana - cctpv1 - using permit
 *  - Ethereum -> Solana - cctpv1 - using approve
 *  - Ethereum -> Solana - avax hop - using permit - fast
 *  - Ethereum -> Solana - avax hop - approve - fast
 *  - Ethereum -> Solana - avax hop - permit - slow
 *  - Ethereum -> Solana - avax hop - approve - slow
 *
 * I'm unsure about the value this granularity adds to the user.
 *
 * We may want instead to make cctpv1 and cctpv2 "routes" that one can choose
 * consider permit, approve and fast "options" on top of it.
 * These options would need to modify the route object when applied
 * such that they reduce they modify the property of the transfer.
 * eg: one could use cctpv2 corridor and:
 * - apply on top of it the "fast" option, which would increase the price and reduce the eta.
 * - apply on top of it the "gas-less" option, which would increase the fee and reduce and reduce
 *   the number of steps
 *
 * eg2: one could use cctpv2 corridor and:
 * - apply on top of it the "approve" option, which would force to use an approval, potentially
 *   adding an approval tx and cost
 *
 * cctp-sdk corridors + quote design fits right in this "corridor + options" model.
 *
 * stable-sdk returns the "dumbed down" version where instead of having corridor + options
 * you get a list of possible routes, which has several limitations.
 *
 * For the time being, I'll return one route for permit and one for approve, per corridor.
 * Issuing an approval tx may not be needed, which would result in only one tx
 * for that route.
 *
 * If the route can be fast, I'll assume the user wants the fast route
 * and return that one.
 *
 * CCTP-SDK only returns one estimatedDuration for the corridor, which I'm
 * guessing so far that is the fast one.
 *
 * @todo: revisit this.
 *
 */
async function buildCorridorRoutes<
  N extends Network,
  S extends SupportedEvmDomain<N>,
>(
  evmClient: ViemEvmClient<N, S>,
  intent: Intent,
  corridor: CorridorStats<Network, keyof EvmDomains, Corridor>,
  gasDropoff: GasTokenOf<SupportedDomain<N>>,
  payInUsdc: boolean,
): Promise<Route[]> {
  const cctprEvm = initCctprEvm(evmClient.network);
  const estimatedDuration = corridor.transferTime.toUnit("sec").toNumber();

  /**
   * @todo: intent.sender and intent.recipient could probably be EvmAddresses
   */
  const intendedAmount = usdc(intent.amount);
  const sender = new EvmAddress(intent.sender);
  const recipient = new EvmAddress(intent.recipient);

  const { corridorFees, maxRelayFee, maxFastFeeUsdc } = getCorridorFees(
    corridor.cost,
    intendedAmount,
    payInUsdc,
    intent.relayFeeMaxChangeMargin,
  );

  const quote = payInUsdc
    ? {
        maxRelayFee: maxRelayFee as Usdc,
        takeFeesFromInput: false,
      }
    : { maxRelayFee: maxRelayFee as GasTokenOf<S, keyof EvmDomains> };

  const corridorSteps = [
    getCorridorStep(corridor.corridor, intent.sourceChain),
  ];

  const sharedRouteData = {
    intent,
    estimatedDuration,
    fees: corridorFees,
    corridor: corridor.corridor,
  };

  const routeWithApprovalSteps = await composeStepsWithApproval(
    evmClient,
    intendedAmount,
    intent.sourceChain,
    sender,
    corridorFees,
    corridorSteps,
  );

  const routeWithApproval: Route = {
    ...sharedRouteData,
    requiresMessageSignature: false,
    steps: routeWithApprovalSteps,
    estimatedTotalCost: await calculateTotalCost(
      routeWithApprovalSteps,
      corridorFees,
    ),
    workflow: cctprEvm.transfer(
      evmClient,
      sender,
      intent.targetChain as SupportedDomain<N>,
      recipient,
      intendedAmount,
      { type: "onChain", ...quote },
      gasDropoff,
      {
        usePermit: false,
        corridor: { type: corridor.corridor, maxFastFeeUsdc },
      } as TODO,
    ),
  };

  const routeWithPermitSteps = composeStepsWithPermit(
    corridorSteps,
    intent.sourceChain,
  );

  const routeWithPermit: Route = {
    ...sharedRouteData,
    requiresMessageSignature: true,
    steps: routeWithPermitSteps,
    estimatedTotalCost: await calculateTotalCost(
      routeWithPermitSteps,
      corridorFees,
    ),
    workflow: cctprEvm.transfer(
      evmClient,
      sender,
      intent.targetChain as SupportedDomain<N>,
      recipient,
      intendedAmount,
      { type: "onChain", ...quote },
      gasDropoff,
      {
        usePermit: true,
        corridor: { type: corridor.corridor, maxFastFeeUsdc },
      } as TODO,
    ),
  };

  return [routeWithApproval, routeWithPermit];
}

function getCorridorFees<N extends Network, S extends keyof EvmDomains>(
  corridorCost: CorridorStats<N, S, Corridor>["cost"],
  intendedAmount: Usdc,
  payInUsdc: boolean,
  relayFeeMaxChangeMargin?: number,
): { corridorFees: Fee[]; maxRelayFee: Fee; maxFastFeeUsdc?: Usdc } {
  const corridorFees = [] as Fee[];

  const relayFee: Fee = payInUsdc
    ? corridorCost.relay[0]
    : corridorCost.relay[1] as GasTokenOf<keyof EvmDomains>;

  const maxChangeMargin = relayFeeMaxChangeMargin ?? RELAY_FEE_MAX_CHANGE_MARGIN;
  const maxRelayFee = relayFee.mul(maxChangeMargin);

  corridorFees.push(maxRelayFee);
  let maxFastFeeUsdc: Usdc | undefined = undefined;

  if (corridorCost.fast !== undefined) {
    /**
     * If the corridor has the "fast" option, then we assume it
     * will be used.
     * Hence we add the fast cost to the fees.
     * See comment above `findRoutes` method for more info.
     */
    const percentage = corridorCost.fast.toUnit("whole");
    maxFastFeeUsdc = usdc(intendedAmount.mul(percentage).toUnit("µUSDC").ceil(), "µUSDC");
    corridorFees.push(maxFastFeeUsdc);
  }

  return { corridorFees, maxRelayFee, maxFastFeeUsdc };
}

function getCorridorStep(
  corridor: Corridor,
  sourceChain: keyof EvmDomains,
): RouteExecutionStep {
  const sharedTxData = {
    platform: "Evm" as const,
    chain: sourceChain,
    type: "sign-and-send-transaction" as const,
  };
  switch (corridor) {
    /**
     * @todo: add sensible values to the gas cost estimation of the corridors.
     *
     * note: we can add more details about the tx here, such as the contract
     *       it needs to be sent.
     */
    case "v1":
      return {
        ...sharedTxData,
        gasCostEstimation: 120_000n,
      };

    case "v2Direct":
      return {
        ...sharedTxData,
        gasCostEstimation: 200_000n,
      };

    case "avaxHop":
      return {
        ...sharedTxData,
        gasCostEstimation: 300_000n,
      };

    default:
      throw new Error(`Corridor: ${corridor} not supported.`);
  }
}

async function composeStepsWithApproval<
  N extends Network,
  D extends keyof EvmDomains,
>(
  evmClient: ViemEvmClient<N, D>,
  intendedAmount: Usdc,
  sourceDomain: keyof EvmDomains,
  sender: EvmAddress,
  fees: Fee[],
  routeSteps: RouteExecutionStep[],
): Promise<RouteExecutionStep[]> {
  const definitions = initDefinitions(evmClient.network);
  const cctpr = initCctpr(evmClient.network);
  const evm = initEvm(evmClient.network);

  const usdcAddress = new EvmAddress(
    definitions.usdcContracts.contractAddressOf[sourceDomain],
  );
  const cctprAddress = new EvmAddress(
    /**
     * @todo: type system thinks contractAddressOf is not callable,
     *        but at runtime it is. Figure out what's up.
     */
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    (cctpr.contractAddressOf as any)(sourceDomain),
  );

  const allowance = await evm.getTokenAllowance(
    evmClient as any,
    usdcAddress,
    sender,
    cctprAddress,
    Usdc,
  );

  const requiredAllowance = await calculateRequiredAllowance(
    allowance,
    intendedAmount,
    fees,
  );

  const approvalSteps = [] as RouteExecutionStep[];

  if (requiredAllowance.gt(usdc(0))) {
    approvalSteps.push({
      platform: "Evm",
      chain: sourceDomain,
      type: "sign-and-send-transaction",
      gasCostEstimation: EVM_APPROVAL_TX_GAS_COST_APROXIMATE,
    });
  }

  return [...approvalSteps, ...routeSteps];
}

// eslint-disable-next-line @typescript-eslint/require-await
async function calculateRequiredAllowance(
  allowance: Usdc,
  intendedAmount: Usdc,
  fees: Fee[],
) {
  const usdcFees = fees.filter((value) => {
    return value.kind.name === "Usdc";
  }) as Usdc[]; // there's definitely a better way typewise to handle this.

  const necessaryAllowance = usdcFees.reduce((total, v) => {
    return total.add(v);
  }, intendedAmount);

  return necessaryAllowance.gt(allowance)
    ? necessaryAllowance.sub(allowance)
    : usdc(0);
}

function composeStepsWithPermit(
  steps: RouteExecutionStep[],
  sourceChain: keyof EvmDomains,
): RouteExecutionStep[] {
  const signPermitStep: RouteExecutionStep = {
    platform: "Evm",
    type: "sign-message",
    chain: sourceChain,
    gasCostEstimation: 0n,
  };

  return [signPermitStep, ...steps];
}

// eslint-disable-next-line @typescript-eslint/require-await
async function calculateTotalCost(
  steps: RouteExecutionStep[],
  fees: Fee[],
): Promise<Usd> {
  // @todo: get the gas token price from the oracle
  const usdPerGasToken: Readonly<
    Record<GasTokenNameOf<keyof EvmDomains>, number>
  > = {
    Eth: 2587.19,
    Avax: 25.59,
    Pol: 0.2533,
    Sonic: 0.5861,
  };
  // @todo: get the USDC price from the oracle
  const usdPerUsdc = 1;
  const usdcPrice = Conversion.from(usd(usdPerUsdc), Usdc);
  // @todo: get the gas price from the oracle
  const gasPrice = 10_300_000_000n;

  const stepsCost = steps.reduce((subtotal, step) => {
    const domain = step.chain;
    const gasTokenKind = gasTokenKindOf(domain);
    const gasTokenPrice = Conversion.from<
      Usd["kind"],
      GasTokenKindOf<typeof domain>
    >(usd(usdPerGasToken[gasTokenNameOf(domain)]), gasTokenKind);
    const gasTokenCost: Amount<typeof gasTokenKind> = gasTokenOf(domain)(
      gasPrice,
      "atomic",
    ).mul(step.gasCostEstimation);
    const usdCost = gasTokenCost.convert(gasTokenPrice);
    return subtotal.add(usdCost);
  }, usd(0));

  const feesCost = fees.reduce((subtotal, fee) => {
    const conversion: Conversion<Usd["kind"], typeof fee.kind> =
      fee.kind.name === "Usdc"
        ? usdcPrice
        : Conversion.from<Usd["kind"], typeof fee.kind>(
            usd(usdPerGasToken[fee.kind.name]),
            fee.kind,
          );
    const usdCost: Usd = (fee as Amount<typeof fee.kind>).convert(conversion);
    return subtotal.add(usdCost);
  }, usd(0));

  return stepsCost.add(feesCost);
}
