// Copyright (c) 2025 Stable Technologies Inc
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import type { Item, CustomizableBytes, DeriveType } from "binary-layout";
import { messageLayoutTemplate, burnMessageLayoutTemplate } from "../../messages.js";

export const nonceItem = { binary: "uint", size: 8 } as const satisfies Item;

export const messageLayout = <
  const B extends CustomizableBytes = undefined,
  R extends boolean = false,
>(messageBody?: B, useRawDomains?: R) =>
  messageLayoutTemplate(0, nonceItem, [], messageBody, useRawDomains);

export type Message<
  B extends CustomizableBytes = undefined,
  R extends boolean = false,
> = DeriveType<ReturnType<typeof messageLayout<B, R>>>;

export const burnMessageLayout = <
  R extends boolean = false,
>(useRawDomains?: R) =>
  messageLayout(burnMessageLayoutTemplate(0), useRawDomains);

export type BurnMessage<
  R extends boolean = false,
> = DeriveType<ReturnType<typeof burnMessageLayout<R>>>;
