import Head from "next/head";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import styles from "@/styles/Home.module.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Stable | Move USDC across networks with high speed and minimal costs</title>
        <link rel="shortcut icon" href="./imgs/favicon-hi.png" />
        <link rel="icon" sizes="196x196" href="./imgs/favicon-hi.png" />
        <meta itemProp="name" content="Stable | Move USDC across networks with high speed and minimal costs" />
        <meta itemProp="description" content="Powered by Circle, Stable's SDK enables instant USDC transfers across networks." />
        <meta itemProp="image" content="https://stable-e58ff.web.app/imgs/og.jpg" /> {/* @todo */}
        <meta property="og:title" content="Stable | Move USDC across networks with high speed and minimal costs" />
        <meta property="og:description" content="Powered by Circle, Stable's SDK enables instant USDC transfers across networks." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://stable-e58ff.web.app/imgs/og.jpg" /> {/* @todo */}
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="700" />
        <meta property="og:image:alt" content="Move USDC across networks with high speed and minimal costs" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Stable | Move USDC across networks with high speed and minimal costs" />
        <meta name="twitter:description" content="Powered by Circle, Stable's SDK enables instant USDC transfers across networks." />
        <meta name="twitter:image" content="https://stable-e58ff.web.app/imgs/og.jpg" /> {/* @todo */}
        <meta name="twitter:image:src" content="https://stable-e58ff.web.app/imgs/og.jpg" /> {/* @todo */}
      </Head>
      <div
        className={`${styles.page} ${geistSans.variable} ${geistMono.variable}`}
      >
        <main className={styles.main}>
          <Image
            className={styles.logo}
            src="/next.svg"
            alt="Next.js logo"
            width={180}
            height={38}
            priority
          />
          <ol>
            <li>
              Get started by editing <code>src/pages/index.tsx</code>.
            </li>
            <li>Save and see your changes instantly.</li>
          </ol>

          <div className={styles.ctas}>
            <a
              className={styles.primary}
              href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                className={styles.logo}
                src="/vercel.svg"
                alt="Vercel logomark"
                width={20}
                height={20}
              />
              Deploy now
            </a>
            <a
              href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.secondary}
            >
              Read our docs
            </a>
          </div>
        </main>
        <footer className={styles.footer}>
          <a
            href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              aria-hidden
              src="/file.svg"
              alt="File icon"
              width={16}
              height={16}
            />
            Learn
          </a>
          <a
            href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              aria-hidden
              src="/window.svg"
              alt="Window icon"
              width={16}
              height={16}
            />
            Examples
          </a>
          <a
            href="https://nextjs.org?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              aria-hidden
              src="/globe.svg"
              alt="Globe icon"
              width={16}
              height={16}
            />
            Go to nextjs.org →
          </a>
        </footer>
      </div>
    </>
  );
}
