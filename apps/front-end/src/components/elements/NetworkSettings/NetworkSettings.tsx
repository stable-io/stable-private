import type { ReactElement } from "react";

import { BalanceDisplay } from "./BalanceDisplay";

import { ChainSelect, WalletChip, SplitLayout } from "@/components";
import type { AvailableChains } from "@/constants";

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
  return (
    <SplitLayout
      className="network-settings"
      left={
        <ChainSelect
          title={title}
          chains={availableChains}
          selectedChain={selectedChain}
          onSelect={onSelectChain}
        />
      }
      right={
        <>
          <WalletChip address={walletAddress} />
          {balance !== undefined && <BalanceDisplay balance={balance} />}
        </>
      }
    />
  );
};
