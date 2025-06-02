import type { JSX, PropsWithChildren } from "react";

import { Footer } from "../Footer";
import { Header } from "../Header";

export type LayoutProps = PropsWithChildren<object>;

export const Layout = ({ children }: LayoutProps): JSX.Element => (
  <div className="bridge-app main">
    <div className="backgrounds">
      <div className="radial-right"></div>
      <div className="radial-left"></div>
      {/* <div className="grid"></div> */}
      <div className="topographic"></div>
      {/* <div className="waves"></div> */}
    </div>
    <div className="container">
      <Header />
      <div className="main-content">{children}</div>
      <Footer />
    </div>
  </div>
);
