import Image from "next/image";
import type { ReactElement } from "react";

import { ChainSelect, WalletChip } from "@/components";
import type { AvailableChains, GasDropoffLevel } from "@/constants";
import { formatNumber } from "@/utils";

interface BridgeWidgetProps {
  amount: number;
  onAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  gasDropoffLevel: GasDropoffLevel;
  onGasDropoffLevelSelect: (level: GasDropoffLevel) => void;
  sourceChain: AvailableChains;
  onSelectSourceChain: (chain: AvailableChains) => void;
  targetChain: AvailableChains;
  onSelectTargetChain: (chain: AvailableChains) => void;
  availableChains: readonly AvailableChains[];
  walletAddress?: string;
  balance: number;
  route?: { corridor: string; estimatedDuration: number } | undefined;
  estimatedDuration: string;
  isInProgress: boolean;
  onTransfer: () => void;
}

export const BridgeWidget = ({
  amount,
  onAmountChange,
  gasDropoffLevel,
  onGasDropoffLevelSelect,
  sourceChain,
  onSelectSourceChain,
  targetChain,
  onSelectTargetChain,
  availableChains,
  walletAddress,
  balance,
  route,
  estimatedDuration,
  isInProgress,
  onTransfer,
}: BridgeWidgetProps): ReactElement => {
  return (
    <div className="bridge-widget">
      <div className="widget-title">
        <h2>Transfer USDC</h2>
      </div>
      <div className="widget-body">
        <div className="select-section select-from-section">
          <div className="network-settings">
            <div className="left">
              <ChainSelect
                title="From"
                chains={availableChains}
                selectedChain={sourceChain}
                onSelect={onSelectSourceChain}
              />
            </div>
            <div className="right">
              <WalletChip address={walletAddress} />
              <div className="balance">
                <span>Balance: {formatNumber(balance)} USDC</span>
              </div>
            </div>
          </div>

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

        <div className="divider">
          <div className="icon-circle">
            <Image
              src="/imgs/arrow-long-down.svg"
              alt=""
              className="arrow-icon"
              unoptimized
              height={12}
              width={10}
            />
          </div>
        </div>

        <div className="select-section select-to-section">
          <div className="network-settings">
            <div className="left">
              <ChainSelect
                title="To"
                chains={availableChains}
                selectedChain={targetChain}
                onSelect={onSelectTargetChain}
              />
            </div>
            <div className="right">
              <WalletChip address={walletAddress} />
            </div>
          </div>
          <div className="gas-settings">
            <div className="left">
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
                <button
                  className={`option ${gasDropoffLevel === "zero" ? "active" : ""}`}
                  onClick={() => onGasDropoffLevelSelect("zero")}
                >
                  Zero
                </button>
                <button
                  className={`option ${gasDropoffLevel === "low" ? "active" : ""}`}
                  onClick={() => onGasDropoffLevelSelect("low")}
                >
                  Low
                </button>
                <button
                  className={`option ${gasDropoffLevel === "avg" ? "active" : ""}`}
                  onClick={() => onGasDropoffLevelSelect("avg")}
                >
                  Avg
                </button>
                <button
                  className={`option ${gasDropoffLevel === "high" ? "active" : ""}`}
                  onClick={() => onGasDropoffLevelSelect("high")}
                >
                  High
                </button>
              </div>
            </div>
            <div className="right">
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
            </div>
          </div>
        </div>

        <div className="divider" style={{ margin: "25px 0px" }}></div>

        {route && (
          <>
            <div className="route-summary">
              <div className="left">
                <Image
                  src="/imgs/route.svg"
                  alt=""
                  className="route-icon"
                  unoptimized
                  height={18}
                  width={18}
                />
                <span>
                  Route: <strong>{route.corridor}</strong>
                </span>
                <span className="badge badge-green">Best Route</span>
              </div>
              <div className="right">
                <div className="meta">
                  <Image
                    src="/imgs/gas.svg"
                    className="icon"
                    alt="Gas fees"
                    unoptimized
                    height={16}
                    width={16}
                  />
                  <span>$3.20</span>
                </div>
                <div className="meta">
                  <Image
                    src="/imgs/time.svg"
                    className="icon"
                    alt="Duration"
                    unoptimized
                    height={16}
                    width={16}
                  />
                  <span>~{estimatedDuration} seconds</span>
                </div>
              </div>
            </div>

            <div className="divider" style={{ margin: "25px 0px" }}></div>
          </>
        )}

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

        <div className="main-cta-container">
          <button className="main-cta" disabled={!route} onClick={onTransfer}>
            {isInProgress && <div className="spinner"></div>}
            <span>Confirm Transfer</span>
          </button>
        </div>
      </div>
    </div>
  );
};
