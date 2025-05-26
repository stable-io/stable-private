import { useState } from "react";
import type { AvailableChains } from "@/constants";
import { ChainSelectButton } from "./ChainSelectButton";
import { ChainSelectMenu } from "./ChainSelectMenu";

export interface ChainSelectProps {
  title: string;
  chains: readonly AvailableChains[];
  selectedChain: AvailableChains;
  onSelect: (network: AvailableChains) => void;
}

export const ChainSelect = ({
  title,
  chains,
  selectedChain,
  onSelect,
}: ChainSelectProps) => {
  const otherChains = chains.filter((chain) => chain !== selectedChain);
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (chain: AvailableChains) => {
    onSelect(chain);
    setIsOpen(false);
  };

  return (
    <div data-testid="ChainSelect" className="network-select">
      <span className="network-select-title">{title}</span>
      <ChainSelectButton
        selectedChain={selectedChain}
        onToggle={handleToggle}
      />
      {isOpen && (
        <ChainSelectMenu chains={otherChains} onSelect={handleSelect} />
      )}
    </div>
  );
};
