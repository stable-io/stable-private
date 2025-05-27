import type { AvailableChains } from "@/constants";
import { ChainSelectItem } from "./ChainSelectItem";

export interface ChainSelectMenuProps {
  chains: readonly AvailableChains[];
  onSelect: (chain: AvailableChains) => void;
}

export const ChainSelectMenu = ({ chains, onSelect }: ChainSelectMenuProps) => (
  <div className="select-menu">
    <ul className="networks">
      {chains.map((chain) => (
        <ChainSelectItem key={chain} chain={chain} onSelect={onSelect} />
      ))}
    </ul>
  </div>
);
