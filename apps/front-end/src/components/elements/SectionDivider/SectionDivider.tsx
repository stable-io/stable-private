import Image from "next/image";
import type { ReactElement } from "react";

interface SectionDividerProps {
  variant?: "arrow"; // @note: Extend with more options
  style?: React.CSSProperties;
}

export const SectionDivider = ({
  variant,
  style,
}: SectionDividerProps): ReactElement => {
  return (
    <div className="divider" style={style}>
      {variant === "arrow" && (
        <div className="icon-circle">
          <Image
            src="/imgs/arrow-long-down.svg"
            alt=""
            className="arrow-icon"
            unoptimized
            height={12}
            width={10}
          />
        </div>
      )}
    </div>
  );
};
