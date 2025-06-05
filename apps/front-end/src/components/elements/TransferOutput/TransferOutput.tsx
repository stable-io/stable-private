import Image from "next/image";
import type { ReactElement } from "react";

import { NetworkSettings, SplitLayout } from "@/components";
import type { AvailableChains, GasDropoffLevel } from "@/constants";

const gasDropoffOptions: GasDropoffLevel[] = ["zero", "low", "avg", "high"];

interface TransferOutputProps {
  targetChain: AvailableChains;
  onSelectTargetChain: (chain: AvailableChains) => void;
  availableChains: readonly AvailableChains[];
  walletAddress?: string;
  gasDropoffLevel: GasDropoffLevel;
  onGasDropoffLevelSelect: (level: GasDropoffLevel) => void;
}

export const TransferOutput = ({
  targetChain,
  onSelectTargetChain,
  availableChains,
  walletAddress,
  gasDropoffLevel,
  onGasDropoffLevelSelect,
}: TransferOutputProps): ReactElement => {
  const gasSettingsLeft = (
    <>
      <span className="label">Destination gas</span>
      <div className="tooltip">
        <Image
          src="/imgs/tooltip.svg"
          alt=""
          className="tooltip-icon"
          unoptimized
          height={14}
          width={14}
        />
      </div>
      <div className="options">
        {gasDropoffOptions.map((level) => (
          <button
            key={level}
            className={`option ${gasDropoffLevel === level ? "active" : ""}`}
            onClick={() => onGasDropoffLevelSelect(level)}
          >
            {level.charAt(0).toUpperCase() + level.slice(1)}
          </button>
        ))}
      </div>
    </>
  );

  const gasSettingsRight = (
    <div className="gas-settings-fees">
      <div className="fee-row">
        <span className="currency">USDC</span>
        <span className="value">0.0</span>
      </div>
      <div className="fee-row">
        <span className="currency">OPT</span>
        <span className="value">~0.0</span>
      </div>
    </div>
  );

  return (
    <div className="select-section select-to-section">
      <NetworkSettings
        title="To"
        selectedChain={targetChain}
        onSelectChain={onSelectTargetChain}
        availableChains={availableChains}
        walletAddress={walletAddress}
      />

      <SplitLayout
        className="gas-settings"
        left={gasSettingsLeft}
        right={gasSettingsRight}
      />
    </div>
  );
};
