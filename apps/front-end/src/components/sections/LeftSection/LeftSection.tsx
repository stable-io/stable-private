import type { ReactNode, ReactElement } from "react";

interface LeftSectionProps {
  children?: ReactNode;
}

export const LeftSection = ({ children }: LeftSectionProps): ReactElement => {
  return (
    <div className="left" style={{ width: "50%" }}>
      {children}
    </div>
  );
};
