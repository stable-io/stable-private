import type { AppProps } from "next/app";
import Head from "next/head";
import type { JSX } from "react";

import { Layout } from "@/components";
import { DynamicProvider, StableProvider } from "@/providers";
import "@/styles/globals.css";

const App = ({ Component, pageProps }: AppProps): JSX.Element => (
  <>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
    <DynamicProvider>
      <StableProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </StableProvider>
    </DynamicProvider>
  </>
);

export default App;
