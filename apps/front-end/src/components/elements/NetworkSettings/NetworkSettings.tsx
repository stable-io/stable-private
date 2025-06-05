import type { ReactElement } from "react";

import { SplitLayout } from "../SplitLayout";

import { ChainSelect, WalletChip } from "@/components";
import type { AvailableChains } from "@/constants";
import { formatNumber } from "@/utils";

interface NetworkSettingsProps {
  title: string;
  selectedChain: AvailableChains;
  onSelectChain: (chain: AvailableChains) => void;
  availableChains: readonly AvailableChains[];
  walletAddress?: string;
  balance?: number;
}

export const NetworkSettings = ({
  title,
  selectedChain,
  onSelectChain,
  availableChains,
  walletAddress,
  balance,
}: NetworkSettingsProps): ReactElement => {
  const leftContent = (
    <ChainSelect
      title={title}
      chains={availableChains}
      selectedChain={selectedChain}
      onSelect={onSelectChain}
    />
  );

  const rightContent = (
    <>
      <WalletChip address={walletAddress} />
      {balance !== undefined && (
        <div className="balance">
          <span>Balance: {formatNumber(balance)} USDC</span>
        </div>
      )}
    </>
  );

  return (
    <SplitLayout
      className="network-settings"
      left={leftContent}
      right={rightContent}
    />
  );
};
