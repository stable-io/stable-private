// Copyright (c) 2025 Stable Technologies Inc
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import type { RoTuple, RoArray } from "@stable-io/map-utils";
import type { Rationalish, Kind, KindWithAtomic, SymbolsOf } from "@stable-io/amount";
import { Amount, Rational } from "@stable-io/amount";
import type { Item, CustomConversion, FixedConversion } from "binary-layout";
import { UniversalAddress } from "./address.js";
import type { Domain, SimplifyDomain } from "./constants/chains/index.js";
import { domains, domainOf, domainIdOf } from "./constants/chains/index.js";
import { DistributiveAmount } from "./constants/kinds.js";

export const uint256Item = {
  binary: "uint", size: 32,
} as const satisfies Item;

export const hashItem = {
  binary: "bytes", size: 32,
} as const satisfies Item;

export const universalAddressItem = {
  binary: "bytes",
  size: UniversalAddress.byteSize,
  custom: {
    to: (encoded: Uint8Array) => new UniversalAddress(encoded),
    from: (addr: UniversalAddress) => addr.toUint8Array(),
  } satisfies CustomConversion<Uint8Array, UniversalAddress>,
} as const satisfies Item;

export const signatureItem = {
  binary: "bytes", size: 65,
} as const satisfies Item;

export const rawDomainItem = {
  binary: "uint", size: 4,
} as const satisfies Item;

// ----

export const domainItem = <
  const DT extends RoTuple<Domain> = typeof domains,
>(domainTuple?: DT) => ({
  ...rawDomainItem,
  custom: {
    to: (val: number): SimplifyDomain<DT[number]> => {
      const domain = domainOf.get(val);
      if (domain === undefined)
        throw new Error(`unknown domainId ${val}`);

      if (domainTuple && !(domainTuple as RoArray<Domain>).includes(domain))
        throw new Error(`Domain ${domain} not in domains ${domainTuple}`);

      return domain as SimplifyDomain<DT[number]>;
    },
    from: (val: SimplifyDomain<DT[number]>): number => domainIdOf(val),
  } satisfies CustomConversion<number, SimplifyDomain<DT[number]>>,
} as const);

export const fixedDomainItem = <const D extends Domain>(domain: D) => ({
  ...rawDomainItem,
  custom: {
    to: domain,
    from: domainIdOf(domain),
  } satisfies FixedConversion<number, D>,
} as const);

// ----

type NumberType<S extends number> = S extends 1 | 2 | 3 | 4 | 5 | 6 ? number : bigint;
type AmountReturnItem<S extends number, K extends Kind> = {
  binary: "uint";
  size: S;
  custom: {
    to: (val: NumberType<S>) => DistributiveAmount<K>;
    from: (amount: DistributiveAmount<K>) => NumberType<S>;
  };
};
type TransformFunc<S extends number> = {
  to: (val: NumberType<S>) => Rationalish;
  from: (val: Rational) => number | bigint;
};

//conversion happens in 3 stages:
// 1. raw value is read from layout
// 2. then it is optionally transformed (e.g. scaled/multiplied/etc.)
// 3. finally it is converted into an amount of the given kind and unit
//and likewise but inverted for the opposite direction
export function amountItem<
  S extends number,
  const K extends KindWithAtomic,
>(
  size: S,
  kind: K,
  unitSymbol?: SymbolsOf<K>,
  transform?: TransformFunc<S>,
): AmountReturnItem<S, K>;
export function amountItem<S extends number, const K extends Kind>(
  size: S,
  kind: K,
  unitSymbol: SymbolsOf<K>,
  transform?: TransformFunc<S>,
): AmountReturnItem<S, K>;
export function amountItem<S extends number, const K extends Kind>(
  size: S,
  kind: K,
  unitSymbol?: SymbolsOf<K>,
  transform?: TransformFunc<S>,
): AmountReturnItem<S, K> {
  const numMaxSize = 6;
  if (unitSymbol === undefined || unitSymbol === "atomic")
    unitSymbol = kind.atomic as SymbolsOf<K>;

  const to = transform === undefined
    ? (val: any) => Amount.from(val, kind, unitSymbol) as DistributiveAmount<K>
    : (val: any) => Amount.from(transform.to(val), kind, unitSymbol) as DistributiveAmount<K>;

  //sacrificing DRYness for directness
  const from = (
    transform === undefined
    ? size > numMaxSize
      ? (amount: DistributiveAmount<K>) =>
        (amount.toUnit(unitSymbol) as Rational).floor()
      : (amount: DistributiveAmount<K>) =>
        Number((amount.toUnit(unitSymbol) as Rational).floor())
    : size > numMaxSize
      ? (amount: DistributiveAmount<K>) =>
        BigInt(transform.from(amount.toUnit(unitSymbol) as Rational))
      : (amount: DistributiveAmount<K>) =>
        Number(transform.from(amount.toUnit(unitSymbol) as Rational))
  ) as (_: DistributiveAmount<K>) => NumberType<S>;

  return { binary: "uint", size, custom: { to, from } };
}
