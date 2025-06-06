import type { ReactElement, ReactNode } from "react";

interface SplitLayoutProps {
  left: ReactNode;
  right: ReactNode;
  className?: string;
}

export const SplitLayout = ({
  left,
  right,
  className = "",
}: SplitLayoutProps): ReactElement => {
  return (
    <div className={className}>
      <div className="left">{left}</div>
      <div className="right">{right}</div>
    </div>
  );
};
