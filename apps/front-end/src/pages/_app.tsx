import type { AppProps } from "next/app";
import Head from "next/head";
import type { ReactElement } from "react";

import { DynamicProvider, StableProvider } from "@/providers";
import type { NextPageWithLayout } from "@/utils";
import "@/styles/globals.css";

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const App = ({ Component, pageProps }: AppPropsWithLayout): ReactElement => {
  const getLayout =
    Component.getLayout ?? ((page: ReactElement): ReactElement => page);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <DynamicProvider>
        <StableProvider>
          {getLayout(<Component {...pageProps} />)}
        </StableProvider>
      </DynamicProvider>
    </>
  );
};

export default App;
