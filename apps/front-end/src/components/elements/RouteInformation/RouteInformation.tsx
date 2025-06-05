import Image from "next/image";
import type { ReactElement } from "react";

import { RouteMetaItem } from "./RouteMetaItem";

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
      <RouteMetaItem iconSrc="/imgs/gas.svg" altText="Gas fees" value="$3.20" />
      <RouteMetaItem
        iconSrc="/imgs/time.svg"
        altText="Duration"
        value={`~${estimatedDuration} seconds`}
      />
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
