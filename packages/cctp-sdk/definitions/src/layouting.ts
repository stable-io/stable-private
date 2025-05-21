// Copyright (c) 2025 Stable Technologies Inc
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import type {
  PlainObject,
  RoPair,
  RoTuple,
  Column,
  Entries,
  TupleZip,
  Spread,
} from "@stable-io/map-utils";
import { column, entries, zip, spread, nest } from "@stable-io/map-utils";
import type { Layout, DeriveType, ProperLayout } from "binary-layout";

export function transform<const L extends Layout, T>(
  layout: L,
  to: (derived: DeriveType<L>) => T,
  from: (transformed: T) => DeriveType<L>) {
  return { binary: "bytes", layout, custom: { to, from } } as const;
}

type NestedBytesItem = { name: string; binary: "bytes"; layout: ProperLayout };
type Unwrap<L extends Layout, I extends NestedBytesItem> =
  DeriveType<L> extends infer O extends PlainObject
  ? I["name"] extends infer N extends keyof O
    ? ReturnType<typeof transform<L, Spread<O, N>>>
    : never
  : never;
export function unwrap<
  const L extends Layout,
  const I extends NestedBytesItem,
>(layout: L, item: I): Unwrap<L, I> {
  return transform(
    layout,
    derived => spread(derived as any, item.name),
    transformed => nest(
      transformed,
      item.name,
      item.layout.map(i => i.name) as any,
    ) as DeriveType<L>,
  ) as any;
}

// ----

type EnumSwitchVariants<V extends RoTuple<RoPair<string, RoTuple>>> =
  Entries<Column<V, 0>> extends infer VE extends RoTuple
  ? Column<V, 1> extends infer VC extends RoTuple
    ? TupleZip<[VE, VC]>
    : never
  : never;

export const enumSwitchVariants = <
  const V extends RoTuple<RoPair<string, RoTuple>>,
>(variants: V): EnumSwitchVariants<V> =>
  zip([entries(column(variants, 0)), column(variants, 1)]) as any as EnumSwitchVariants<V>;

export const byteSwitchLayout = <
  const I extends string,
  const L extends RoTuple,
>(idTag: I, layouts: L) =>
  ({ binary: "switch", idSize: 1, idTag, layouts: layouts } as const);

export const arrayLayout = <const L extends Layout>(layout: L) =>
  ({ binary: "array", layout } as const);
