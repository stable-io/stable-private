import { PropsWithChildren } from "react";

import { Header } from "../Header";
import { Footer } from "../Footer";

export type LayoutProps = PropsWithChildren<object>;

export const Layout = ({ children }: LayoutProps) => (
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
      <div className="main-content">
        {children}
      </div>
      <Footer />
    </div>
  </div>
);
