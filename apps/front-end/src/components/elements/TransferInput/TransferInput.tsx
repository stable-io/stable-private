import Image from "next/image";
import type { ReactElement } from "react";

import { NetworkSettings } from "@/components";
import type { AvailableChains } from "@/constants";

interface TransferInputProps {
  sourceChain: AvailableChains;
  onSelectSourceChain: (chain: AvailableChains) => void;
  availableChains: readonly AvailableChains[];
  amount: number;
  onAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  walletAddress?: string;
  balance: number;
}

export const TransferInput = ({
  sourceChain,
  onSelectSourceChain,
  availableChains,
  amount,
  onAmountChange,
  walletAddress,
  balance,
}: TransferInputProps): ReactElement => {
  return (
    <div className="select-section select-from-section">
      <NetworkSettings
        title="From"
        selectedChain={sourceChain}
        onSelectChain={onSelectSourceChain}
        availableChains={availableChains}
        walletAddress={walletAddress}
        balance={balance}
      />

      <div className="amount-section">
        <Image
          src="/imgs/usdc-icon.svg"
          alt="USDC"
          className="usdc-icon"
          unoptimized
          height={32}
          width={32}
        />
        <input
          type="number"
          value={amount}
          onChange={onAmountChange}
          placeholder="Enter amount"
          min="0"
          step="0.000001"
        />
      </div>
    </div>
  );
};
