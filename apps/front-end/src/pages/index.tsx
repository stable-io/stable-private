import type { Network, Route } from "@stable-io/sdk";
import Stable from "@stable-io/sdk";
import type { Url } from "@stable-io/utils";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { createWalletClient, http } from "viem";
import { mnemonicToAccount } from "viem/accounts";
import type { Chain } from "viem/chains";
import { useEffect, useState } from "react";
import { formatNumber, truncateAddress } from "../utils";

const getExplorerUrl = (network: Network, txHash: string): string =>
  `https://wormholescan.io/#/tx/${txHash}?network=${network}`;

const mnemonic = process.env["NEXT_PUBLIC_MNEMONIC"]!;
const account = mnemonicToAccount(mnemonic);
const signer = {
  platform: "Evm" as const,
  getWalletClient: (chain: Chain, url: Url) => createWalletClient({
      account,
      chain,
      transport: http(url),
    }),
};
const stable = new Stable({
  network: "Testnet",
  signer,
});

type GasDropoffLevel = "zero" | "low" | "avg" | "high";

export default function Home() {
  const sourceChain = "Ethereum";
  const targetChain = "Arbitrum";

  // @todo: Update with actual values, probably dependent on the chain
  const maxGasDropoff = 10n ** 15n; // eg 0.001 ETH
  const gasDropoffs: Record<GasDropoffLevel, bigint> = {
    zero: 0n,
    low: maxGasDropoff / 3n,
    avg: maxGasDropoff * 2n / 3n,
    high: maxGasDropoff,
  };

  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState(0);
  const [gasDropoffLevel, setGasDropoffLevel] = useState<GasDropoffLevel>("zero");
  const gasDropoffDesired = gasDropoffs[gasDropoffLevel];
  const [route, setRoute] = useState<Route | undefined>();
  const [isInProgress, setIsInProgress] = useState(false);
  const [txHashes, setTxHashes] = useState<readonly string[] | undefined>();
  const explorerUrl = txHashes ? getExplorerUrl("Testnet", txHashes.at(-1)!) : "#";

  const updateBalance = () => {
    stable.getBalance(account.address, [sourceChain]).then((balances) => {
      setBalance(Number.parseFloat(balances[sourceChain]));
      return;
    }).catch((error: unknown) => {
      console.error(error);
    });
  };

  const estimatedDuration = route?.estimatedDuration.toString(10) ?? "??";

  // @todo: Subtract expected fees
  // const maxAmount = balance;
  // const handleMaxAmount = () => {
  //   setAmount(maxAmount);
  // };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAmount = Number.parseFloat(e.target.value) || 0;
    setAmount(newAmount);
  };

  const handleTransfer = () => {
    if (!route) {
      return;
    }
    setIsInProgress(true);
    setTxHashes(undefined);
    stable.executeRoute(route).then((txHashes) => {
      setTxHashes(txHashes);
      updateBalance();
    }).catch((error: unknown) => {
      console.error(error);
    }).finally(() => {
      setIsInProgress(false);
    });
  };

  useEffect(() => {
    updateBalance();
  }, []);

  useEffect(() => {
    setRoute(undefined);
    stable.findRoutes({
      sourceChain,
      targetChain,
      amount: amount.toString(10),
      sender: account.address,
      recipient: account.address,
      gasDropoffDesired,
    }, {}).then((result) => {
      setRoute(result.all[3]); // v2Direct, fast with permit
    }).catch((error: unknown) => {
      console.error(error);
    });
  }, [amount, gasDropoffDesired]);

  return (
    <>
      <Head>
        <meta charSet="utf-8"/>
        <meta httpEquiv="X-UA-Compatible" content="IE=edge"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <title>Stable | Move USDC across networks with high speed and minimal costs</title>
        <link rel="shortcut icon" href="./imgs/favicon-hi.png"/>
        <link rel="icon" sizes="196x196" href="./imgs/favicon-hi.png"/>
        <meta itemProp="name" content="Stable | Move USDC across networks with high speed and minimal costs"/>
        <meta itemProp="description" content="Powered by Circle, Stable's SDK enables instant USDC transfers across networks."/>
        <meta itemProp="image" content="https://stable-e58ff.web.app/imgs/og.jpg"/> {/* @todo */}
        <meta property="og:title" content="Stable | Move USDC across networks with high speed and minimal costs"/>
        <meta property="og:description" content="Powered by Circle, Stable's SDK enables instant USDC transfers across networks."/>
        <meta property="og:type" content="website"/>
        <meta property="og:image" content="https://stable-e58ff.web.app/imgs/og.jpg"/> {/* @todo */}
        <meta property="og:image:type" content="image/jpeg"/>
        <meta property="og:image:width" content="1200"/>
        <meta property="og:image:height" content="700"/>
        <meta property="og:image:alt" content="Move USDC across networks with high speed and minimal costs"/>
        <meta name="twitter:card" content="summary_large_image"/>
        <meta name="twitter:title" content="Stable | Move USDC across networks with high speed and minimal costs"/>
        <meta name="twitter:description" content="Powered by Circle, Stable's SDK enables instant USDC transfers across networks."/>
        <meta name="twitter:image" content="https://stable-e58ff.web.app/imgs/og.jpg"/> {/* @todo */}
        <meta name="twitter:image:src" content="https://stable-e58ff.web.app/imgs/og.jpg"/> {/* @todo */}
      </Head>
      <div className="bridge-app main">
        <div className="backgrounds">
          <div className="radial-right"></div>
          <div className="radial-left"></div>
          {/* <div className="grid"></div> */}
          <div className="topographic"></div>
          {/* <div className="waves"></div> */}
        </div>
        <div className="container">
          <div className="top-nav">
            <div className="left">
              <Link href="/"><h1 className="logo"></h1></Link>
            </div>
            <div className="right">
              <ul className="nav">
                <li className="active"><a href="#">USDC Bridge</a></li>
                <li><a href="#">Stable SDK</a></li>
                <li><a href="#">Why Stable</a></li>
                <li><a href="mailto:hello@stable.io">Reach out</a></li>
              </ul>
              <button className="hamburger-menu">
                <Image src="./imgs/hamburger-menu.svg" alt="" unoptimized />
              </button>
            </div>
          </div>

          <div className="main-content">
            {txHashes && <div className="top">
              <div className="alert alert-success">
                <h3>Transfer Complete</h3>
                {/* @todo: Add explorer link */}
                <p>Your USDC has been successfully bridged to {targetChain}. You can now view it in your wallet or explore the transaction on <a href={explorerUrl} target="_blank">our explorer</a>.</p>
              </div>
            </div>}
            <div className="left" style={{ width: "50%" }}>
              <div className="bridge-widget">
                <div className="widget-title">
                  <h2>Transfer USDC</h2>
                </div>
                <div className="widget-body">
                  <div className="select-section select-from-section">
                    <div className="network-settings">
                      <div className="left">
                        <div className="network-select">
                          <span className="network-select-title">From</span>
                          <div className="network-select-btn">
                            <Image src="./imgs/eth-logo.svg" className="network-logo" alt="Ethereum" unoptimized />
                            <span>{sourceChain}</span>
                            <Image src="./imgs/arrow-down.svg" alt="" className="arrow" unoptimized />
                          </div>
                          {/* <div className="select-menu">
                            <ul className="networks">
                              <li className="selected">
                                <img
                                  src="./imgs/eth-logo.svg"
                                  className="network-logo item-icon"
                                  alt="Ethereum"
                                />
                                <span>Ethereum</span>
                                <img
                                  src="./imgs/check.svg"
                                  className="selected-icon"
                                  alt="Selected"
                                />
                              </li>
                              <li>
                                <img
                                  src="./imgs/eth-logo.svg"
                                  className="network-logo item-icon"
                                  alt="Ethereum"
                                />
                                <span>Ethereum</span>
                              </li>
                              <li>
                                <img
                                  src="./imgs/eth-logo.svg"
                                  className="network-logo item-icon"
                                  alt="Ethereum"
                                />
                                <span>Ethereum</span>
                              </li>
                            </ul>
                          </div> */} {/* @todo */}
                        </div>
                      </div>
                      <div className="right">
                        <div className="wallet-chip">
                          <Image src="./imgs/metamask-logo.svg" alt="MetaMask" className="wallet-icon" unoptimized />
                          <span className="address">{truncateAddress(account.address)}</span>
                          <button className="edit-btn">Edit</button>
                        </div>
                        <div className="balance">
                          <span>Balance: {formatNumber(balance)} USDC</span>
                        </div>

                      </div>
                    </div>

                    <div className="amount-section">
                      <Image src="./imgs/usdc-icon.svg" alt="USDC" className="usdc-icon" unoptimized />
                      <input
                        type="number"
                        value={amount}
                        onChange={handleAmountChange}
                        placeholder="Enter amount"
                        min="0"
                        // max={maxAmount} // @todo
                        step="0.000001"
                      />
                      {/* <button className="max-button" onClick={handleMaxAmount}>MAX</button> */}
                    </div>
                  </div>

                  <div className="divider">
                    <div className="icon-circle">
                      <Image src="./imgs/arrow-long-down.svg" alt="" className="arrow-icon" unoptimized />
                    </div>
                  </div>

                  <div className="select-section select-from-section">
                    <div className="network-settings">
                      <div className="left">
                        <div className="network-select">
                          <span className="network-select-title">To</span>
                          <div className="network-select-btn">
                            <Image src="./imgs/arb-logo.svg" className="network-logo" alt="Arbitrum" unoptimized />
                            <span>{targetChain}</span>
                            <Image src="./imgs/arrow-down.svg" alt="" className="arrow" unoptimized />
                          </div>
                        </div>
                      </div>
                      <div className="right">
                        <div className="wallet-chip">
                          <Image src="./imgs/metamask-logo.svg" alt="MetaMask" className="wallet-icon" unoptimized />
                          <span className="address">{truncateAddress(account.address)}</span>
                          <button className="edit-btn">Edit</button>
                        </div>
                      </div>
                    </div>
                    <div className="gas-settings">
                      <div className="left">
                        <span className="label">Destination gas</span>
                        <div className="tooltip">
                          <Image src="./imgs/tooltip.svg" alt="" className="tooltip-icon" unoptimized />
                        </div>
                        <div className="options">
                          <button className={`option ${gasDropoffLevel === "zero" ? "active" : ""}`} onClick={() => setGasDropoffLevel("zero")}>Zero</button>
                          <button className={`option ${gasDropoffLevel === "low" ? "active" : ""}`} onClick={() => setGasDropoffLevel("low")}>Low</button>
                          <button className={`option ${gasDropoffLevel === "avg" ? "active" : ""}`} onClick={() => setGasDropoffLevel("avg")}>Avg</button>
                          <button className={`option ${gasDropoffLevel === "high" ? "active" : ""}`} onClick={() => setGasDropoffLevel("high")}>High</button>
                        </div>
                      </div>
                      <div className="right">
                        <div className="gas-settings-fees">
                          <div className="fee-row">
                            <span className="currency">USDC</span>
                            <span className="value">0.0</span>
                          </div>
                          <div className="fee-row">
                            <span className="currency">OPT</span>
                            <span className="value">~0.0</span>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>

                  <div className="divider" style={{ margin: "25px 0px" }}></div>

                  <div className="route-summary">
                    <div className="left">
                      <Image src="./imgs/route.svg" alt="" className="route-icon" unoptimized />
                      <span>Route: <strong>V2 Fast</strong></span>
                      <span className="badge badge-green">Best Route</span>
                    </div>
                    <div className="right">
                      <div className="meta">
                        <Image src="./imgs/gas.svg" className="icon" alt="Gas fees" unoptimized />
                        <span>$3.20</span>
                      </div>
                      <div className="meta">
                        <Image src="./imgs/time.svg" className="icon" alt="Duration" unoptimized />
                        <span>~{estimatedDuration} seconds</span>
                      </div>
                    </div>
                  </div>

                  <div className="divider" style={{ margin: "25px 0px" }}></div>

                  <div className="summary">
                    <div className="row">
                      <span className="label">Estimated time</span>
                      <span className="value">~{estimatedDuration} seconds</span>
                    </div>
                    {/* <div className="row">
                      <span className="label">Bridge fee</span>
                      <span className="value">$2.00</span>
                    </div> */}
                    <div className="row">
                      <span className="label">Destination gas</span>
                      <span className="value">$0.00</span>
                    </div>
                    <div className="row total">
                      <span className="label">You receive</span>
                      <span className="value">
                      <Image src="./imgs/usdc-icon.svg" alt="USDC" className="usdc-icon" unoptimized />
                      {formatNumber(amount)} USDC
                      </span>
                    </div>
                  </div>

                  <div className="main-cta-container">
                    <button className="main-cta" disabled={!route} onClick={handleTransfer}>
                      {isInProgress && <div className="spinner"></div>}
                      <span>Confirm Transfer</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="right" style={{ width: "calc(100% - 50% - 30px)", marginLeft: "30px" }}>
              <div className="sidebar">
                <ul className="tabs">
                  <li className="active">My Portfolio</li>
                  <li>History</li>
                </ul>
                <div className="sidebar-content">
                  <p style={{ textAlign: "center", padding: "260px 0px", opacity: ".6" }}>Portfolio view goes here..</p>
                </div>
              </div>
            </div>
          </div>

          <footer>
            <div className="left">
            </div>
            <div className="right">
              <ul>
                <li><a href="https://x.com/stable_io" target="_blank"><button className="social-media-btn"><Image src="./imgs/x-logo.svg" alt="" unoptimized /></button></a></li>
              </ul>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}
