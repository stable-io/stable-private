import type { ReactNode, ReactElement } from "react";

interface TopSectionProps {
  children?: ReactNode;
}

export const TopSection = ({
  children,
}: TopSectionProps): ReactElement | undefined => {
  if (!children) {
    return undefined;
  }
  return <div className="top">{children}</div>;
};
