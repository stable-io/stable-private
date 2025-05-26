import Image from "next/image";
import { useState } from "react";
import type { AvailableChains } from "@/constants";
import { availableChains, chainLogos } from "@/constants";

export interface ChainSelectProps {
  title: string;
  selectedChain: AvailableChains;
  onSelect: (network: AvailableChains) => void;
}

export const ChainSelect = ({
  title,
  selectedChain,
  onSelect,
}: ChainSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div data-testid="ChainSelect" className="network-select">
      <span className="network-select-title">{title}</span>
      <div className="network-select-btn" onClick={() => setIsOpen(!isOpen)}>
        <Image
          src={chainLogos[selectedChain]}
          className="network-logo"
          alt={selectedChain}
          unoptimized
          height={24}
          width={24}
        />
        <span>{selectedChain}</span>
        <Image
          src="./imgs/arrow-down.svg"
          alt=""
          className="arrow"
          unoptimized
          height={6}
          width={10}
        />
      </div>
      {isOpen && (
        <div className="select-menu">
          <ul className="networks">
            {availableChains
              .filter((chain) => chain !== selectedChain)
              .map((chain) => (
                <li
                  key={chain}
                  onClick={() => {
                    onSelect(chain);
                    setIsOpen(false);
                  }}
                >
                  <Image
                    src={chainLogos[chain]}
                    className="network-logo item-icon"
                    alt={chain}
                    unoptimized
                    height={24}
                    width={24}
                  />
                  <span>{chain}</span>
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
};
