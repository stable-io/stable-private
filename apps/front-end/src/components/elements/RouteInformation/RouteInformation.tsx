import Image from "next/image";
import type { ReactElement } from "react";

import { SectionDivider, SplitLayout } from "@/components";

interface RouteInformationProps {
  route?: { corridor: string; estimatedDuration: number } | undefined;
  estimatedDuration: string;
}

export const RouteInformation = ({
  route,
  estimatedDuration,
}: RouteInformationProps): ReactElement | undefined => {
  if (!route) {
    return undefined;
  }

  const leftContent = (
    <>
      <Image
        src="/imgs/route.svg"
        alt=""
        className="route-icon"
        unoptimized
        height={18}
        width={18}
      />
      <span>
        Route: <strong>{route.corridor}</strong>
      </span>
      <span className="badge badge-green">Best Route</span>
    </>
  );

  const rightContent = (
    <>
      <div className="meta">
        <Image
          src="/imgs/gas.svg"
          className="icon"
          alt="Gas fees"
          unoptimized
          height={16}
          width={16}
        />
        <span>$3.20</span>
      </div>
      <div className="meta">
        <Image
          src="/imgs/time.svg"
          className="icon"
          alt="Duration"
          unoptimized
          height={16}
          width={16}
        />
        <span>~{estimatedDuration} seconds</span>
      </div>
    </>
  );

  return (
    <>
      <SplitLayout
        className="route-summary"
        left={leftContent}
        right={rightContent}
      />

      <SectionDivider style={{ margin: "25px 0px" }} />
    </>
  );
};
