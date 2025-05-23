export const truncateAddress = (address: string) => `${address.slice(0, 4)}...${address.slice(-4)}`;

export const formatNumber = (num: number): string => num.toLocaleString('en-US', {
  maximumFractionDigits: 6,
  minimumFractionDigits: 0
});

const bigintReplacer = (key: string, value: unknown) => typeof value === "bigint" ? value.toString() : value;
export const stringify = (obj: unknown) => JSON.stringify(obj, bigintReplacer, 2);
