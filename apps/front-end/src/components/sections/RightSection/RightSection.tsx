import type { ReactNode, ReactElement } from "react";

interface RightSectionProps {
  children?: ReactNode;
}

export const RightSection = ({ children }: RightSectionProps): ReactElement => {
  return (
    <div
      className="right"
      style={{ width: "calc(100% - 50% - 30px)", marginLeft: "30px" }}
    >
      {children}
    </div>
  );
};
