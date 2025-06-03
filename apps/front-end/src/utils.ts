import type { NextPage } from "next";
import type { ReactElement, ReactNode } from "react";

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

export const truncateAddress = (address: string): string =>
  `${address.slice(0, 4)}...${address.slice(-4)}`;

export const formatNumber = (num: number): string =>
  num.toLocaleString("en-US", {
    maximumFractionDigits: 6,
    minimumFractionDigits: 0,
  });

const bigintReplacer = (key: string, value: unknown): unknown =>
  typeof value === "bigint" ? value.toString() : value;
export const stringify = (obj: unknown): string =>
  JSON.stringify(obj, bigintReplacer, 2);
