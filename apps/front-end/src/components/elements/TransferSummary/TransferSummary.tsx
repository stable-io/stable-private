import Image from "next/image";
import type { ReactElement } from "react";

import { formatNumber } from "@/utils";

interface TransferSummaryProps {
  estimatedDuration: string;
  amount: number;
}

export const TransferSummary = ({
  estimatedDuration,
  amount,
}: TransferSummaryProps): ReactElement => {
  return (
    <div className="summary">
      <div className="row">
        <span className="label">Estimated time</span>
        <span className="value">~{estimatedDuration} seconds</span>
      </div>
      <div className="row">
        <span className="label">Destination gas</span>
        <span className="value">$0.00</span>
      </div>
      <div className="row total">
        <span className="label">You receive</span>
        <span className="value">
          <Image
            src="/imgs/usdc-icon.svg"
            alt="USDC"
            className="usdc-icon"
            unoptimized
            height={32}
            width={32}
          />
          {formatNumber(amount)} USDC
        </span>
      </div>
    </div>
  );
};
