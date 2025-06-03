import Head from "next/head";
import Image from "next/image";
import type { ReactElement } from "react";

import { LandingLayout } from "@/components";
import type { NextPageWithLayout } from "@/utils";

const Home: NextPageWithLayout = (): ReactElement => (
  <>
    <Head>
      <title>
        Stable | Move USDC across networks with high speed and minimal costs
      </title>
    </Head>
    <div className="hero">
      <h1 style={{ color: "#29233C" }}>
        Move <span style={{ color: "#7667EC" }}>USDC</span> across chains.
        Blazing <span style={{ color: "#48C6DA" }}>FAST!</span>
      </h1>
      <h2>
        Powered by Circle, Stable&apos;s SDK enables instant USDC transfers
        across networks.
      </h2>
      <a href="mailto:hello@stable.io">
        <button className="main-cta">Get in Touch Now</button>
      </a>
    </div>
    <div className="offerings">
      <ul>
        <li>
          <Image
            src="/imgs/radial-circle-0.png"
            className="icon"
            alt=""
            width={64}
            height={64}
          />
          <h3>Fast & cost-efficient USDC transfers</h3>
          <p>
            Seamlessly move USDC across networks with high speed and minimal
            costs.
          </p>
        </li>
        <li>
          <Image
            src="/imgs/radial-circle-1.png"
            className="icon"
            alt=""
            width={64}
            height={64}
          />
          <h3>Built for developers, designed for scale</h3>
          <p>
            A developer-friendly SDK designed for a smooth, intuitive
            integration experience.
          </p>
        </li>
        <li>
          <Image
            src="/imgs/radial-circle-2.png"
            className="icon"
            alt=""
            width={64}
            height={64}
          />
          <h3>All the features you need and more...</h3>
          <p>
            Mainnet and testnet support, gas drop-off, live transfer tracking,
            and a lot more!
          </p>
        </li>
      </ul>
    </div>
  </>
);

Home.getLayout = (page: ReactElement): ReactElement => (
  <LandingLayout>{page}</LandingLayout>
);

export default Home;
