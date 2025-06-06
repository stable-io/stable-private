import type { ReactElement } from "react";

interface TransferButtonProps {
  onTransfer: () => void;
  isInProgress: boolean;
  disabled: boolean;
}

export const TransferButton = ({
  onTransfer,
  isInProgress,
  disabled,
}: TransferButtonProps): ReactElement => {
  return (
    <div className="main-cta-container">
      <button className="main-cta" disabled={disabled} onClick={onTransfer}>
        {isInProgress && <div className="spinner"></div>}
        <span>Confirm Transfer</span>
      </button>
    </div>
  );
};
