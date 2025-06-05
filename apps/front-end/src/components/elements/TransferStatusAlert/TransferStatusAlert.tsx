import type { ReactElement } from "react";

import { getExplorerUrl } from "@/utils";

interface TransferStatusAlertProps {
  txHash: string;
  targetChain: string;
}

export const TransferStatusAlert = ({
  txHash,
  targetChain,
}: TransferStatusAlertProps): ReactElement => {
  const explorerUrl = txHash ? getExplorerUrl("Testnet", txHash) : "#";
  return (
    <div className="alert alert-success">
      <h3>Transfer Complete</h3>
      <p>
        Your USDC has been successfully bridged to {targetChain}. You can now
        view it in your wallet or explore the transaction on{" "}
        <a href={explorerUrl} target="_blank">
          our explorer
        </a>
        .
      </p>
    </div>
  );
};
