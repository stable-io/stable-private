import Image from "next/image";
import type { AvailableChains } from "@/constants";
import { chainLogos } from "@/constants";

export interface ChainSelectButtonProps {
  selectedChain: AvailableChains;
  onToggle: () => void;
}

export const ChainSelectButton = ({
  selectedChain,
  onToggle,
}: ChainSelectButtonProps) => (
  <div className="network-select-btn" onClick={onToggle}>
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
);
