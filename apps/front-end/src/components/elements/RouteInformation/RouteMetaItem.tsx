import Image from "next/image";
import type { ReactElement, ReactNode } from "react";

interface RouteMetaItemProps {
  iconSrc: string;
  altText: string;
  value: ReactNode;
}

export const RouteMetaItem = ({
  iconSrc,
  altText,
  value,
}: RouteMetaItemProps): ReactElement => {
  return (
    <div className="meta">
      <Image
        src={iconSrc}
        className="icon"
        alt={altText}
        unoptimized
        height={16}
        width={16}
      />
      <span>{value}</span>
    </div>
  );
};
