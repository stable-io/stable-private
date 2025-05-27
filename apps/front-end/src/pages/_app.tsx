import type { AppProps } from "next/app";
import Head from "next/head";
import "@/styles/globals.css";
import { Layout } from "@/components/sections/Layout";

const App = ({ Component, pageProps }: AppProps) => (
  <>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
    <Layout>
      <Component {...pageProps} />;
    </Layout>
  </>
);

export default App;
