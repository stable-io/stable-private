import type { ReactElement, ReactNode } from "react";

interface SummaryRowProps {
  label: string;
  value: ReactNode;
  isTotal?: boolean;
}

export const SummaryRow = ({
  label,
  value,
  isTotal = false,
}: SummaryRowProps): ReactElement => {
  return (
    <div className={`row ${isTotal ? "total" : ""}`}>
      <span className="label">{label}</span>
      <span className="value">{value}</span>
    </div>
  );
};
