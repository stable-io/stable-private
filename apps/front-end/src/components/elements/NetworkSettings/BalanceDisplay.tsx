import type { ReactElement } from "react";

import { formatNumber } from "@/utils";

interface BalanceDisplayProps {
  balance: number;
}

export const BalanceDisplay = ({
  balance,
}: BalanceDisplayProps): ReactElement => {
  return (
    <div className="balance">
      <span>Balance: {formatNumber(balance)} USDC</span>
    </div>
  );
};
