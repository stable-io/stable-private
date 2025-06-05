import type { PropsWithChildren, ReactElement } from "react";

import { Background } from "../../elements/Background";
import { Footer } from "../../sections/Footer";
import { Header } from "../../sections/Header";

export type LandingLayoutProps = PropsWithChildren<object>;

export const LandingLayout = ({
  children,
}: LandingLayoutProps): ReactElement => (
  <div className="landing main">
    <Background />
    <div className="container">
      <Header />
      {children}
      <Footer />
    </div>
  </div>
);
