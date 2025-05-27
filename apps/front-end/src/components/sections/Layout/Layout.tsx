import { PropsWithChildren } from "react";

import { Header } from "../Header";
import { Footer } from "../Footer";

export type LayoutProps = PropsWithChildren<object>;

export const Layout = ({ children }: LayoutProps) => {
    return (
        <div data-testid="Layout">
            <Header />
            {children}
            <Footer />
        </div>
    );
};
