import type { Network, Route } from "@stable-io/sdk";
import Stable from "@stable-io/sdk";
import type { Url } from "@stable-io/utils";
import Head from "next/head";
import Link from "next/link";
import { createWalletClient, http } from "viem";
import { mnemonicToAccount } from "viem/accounts";
import type { Chain } from "viem/chains";
import { useEffect, useState } from "react";

const truncateAddress = (address: string) => `${address.slice(0, 4)}...${address.slice(-4)}`;

const formatNumber = (num: number): string => num.toLocaleString('en-US', {
  maximumFractionDigits: 6,
  minimumFractionDigits: 0
});

const bigintReplacer = (key: string, value: unknown) => typeof value === "bigint" ? value.toString() : value;
const stringify = (obj: unknown) => JSON.stringify(obj, bigintReplacer, 2);

const getExplorerUrl = (network: Network, txHash: string): string =>
  `https://wormholescan.io/#/tx/${txHash}?network=${network}`;

const mnemonic = process.env['NEXT_PUBLIC_MNEMONIC']!;
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

export default function Home() {
  const sourceChain = "Ethereum";
  const targetChain = "Arbitrum";
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState(0);
  const [route, setRoute] = useState<Route | undefined>(undefined);
  const [isInProgress, setIsInProgress] = useState(false);
  const [txHashes, setTxHashes] = useState<readonly string[] | undefined>(undefined);
  const explorerUrl = txHashes ? getExplorerUrl("Testnet", txHashes.at(-1)!) : "#";

  const updateBalance = () => {
    stable.getBalance(account.address, [sourceChain]).then(balances => {
      setBalance(parseFloat(balances[sourceChain]));
    }).catch(err => {
      console.error(err);
    });
  }

  const estimatedDuration = route?.estimatedDuration.toString(10) ?? "??";

  // @todo: Subtract expected fees
  // const maxAmount = balance;
  // const handleMaxAmount = () => {
  //   setAmount(maxAmount);
  // };
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAmount = parseFloat(e.target.value) || 0;
    setAmount(newAmount);
  };

  const handleTransfer = async () => {
    if (!route) {
      return;
    }
    setIsInProgress(true);
    setTxHashes(undefined);
    try {
      const txHashes = await stable.executeRoute(route);
      setTxHashes(txHashes);
      updateBalance();
    } catch (error) {
      console.error(error);
    } finally {
      setIsInProgress(false);
    }
  };

  useEffect(() => {
    updateBalance();
  }, [])

  useEffect(() => {
    stable.findRoutes({
      sourceChain,
      targetChain,
      amount: amount.toString(10),
      sender: account.address,
      recipient: account.address,
    }, {}).then(result => {
      console.log(stringify(result));
      setRoute(result.all[3]); // v2Direct, fast with permit
    }).catch(err => {
      console.error(err)
    });
  }, [amount]);

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
              <button className="hamburger-menu"><img src="./imgs/hamburger-menu.svg" alt=""/></button>
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
            <div className="left" style={{width: "50%"}}>
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
                            <img src="./imgs/eth-logo.svg" className="network-logo" alt="Ethereum"/>
                            <span>{sourceChain}</span>
                            <img src="./imgs/arrow-down.svg" alt="" className="arrow"/>
                          </div>
                          {/* <div className="select-menu">
                            <ul className="networks">
                              <li className="selected">
                                <img src="./imgs/eth-logo.svg" className="network-logo item-icon" alt="Ethereum"/>
                                <span>Ethereum</span>
                                <img src="./imgs/check.svg" className="selected-icon" alt="Selected"/>
                              </li>
                              <li>
                                <img src="./imgs/eth-logo.svg" className="network-logo item-icon" alt="Ethereum"/>
                                <span>Ethereum</span>
                              </li>
                              <li>
                                <img src="./imgs/eth-logo.svg" className="network-logo item-icon" alt="Ethereum"/>
                                <span>Ethereum</span>
                              </li>
                            </ul>
                          </div> */} {/* @todo */}
                        </div>
                      </div>
                      <div className="right">
                        <div className="wallet-chip">
                          <img src="./imgs/metamask-logo.svg" alt="MetaMask" className="wallet-icon"/>
                          <span className="address">{truncateAddress(account.address)}</span>
                          <button className="edit-btn">Edit</button>
                        </div>
                        <div className="balance">
                          <span>Balance: {formatNumber(balance)} USDC</span>
                        </div>

                      </div>
                    </div>

                    <div className="amount-section">
                      <img src="./imgs/usdc-icon.svg" alt="USDC" className="usdc-icon"/>
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
                      <img src="./imgs/arrow-long-down.svg" alt="" className="arrow-icon"/>
                    </div>
                  </div>

                  <div className="select-section select-from-section">
                    <div className="network-settings">
                      <div className="left">
                        <div className="network-select">
                          <span className="network-select-title">To</span>
                          <div className="network-select-btn">
                            <img src="./imgs/arb-logo.svg" className="network-logo" alt="Arbitrum"/>
                            <span>{targetChain}</span>
                            <img src="./imgs/arrow-down.svg" alt="" className="arrow"/>
                          </div>
                        </div>
                      </div>
                      <div className="right">
                        <div className="wallet-chip">
                          <img src="./imgs/metamask-logo.svg" alt="MetaMask" className="wallet-icon"/>
                          <span className="address">{truncateAddress(account.address)}</span>
                          <button className="edit-btn">Edit</button>
                        </div>
                      </div>
                    </div>
                    <div className="gas-settings">
                      <div className="left">
                        <span className="label">Destination gas</span>
                        <div className="tooltip">
                          <img src="./imgs/tooltip.svg" alt="" className="tooltip-icon"/>
                        </div>
                        <div className="options">
                          <button className="option active">Zero</button>
                          <button className="option">Low</button>
                          <button className="option">Avg</button>
                          <button className="option">High</button>
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

                  <div className="divider" style={{margin: "25px 0px"}}></div>

                  <div className="route-summary">
                    <div className="left">
                      <img src="./imgs/route.svg" alt="" className="route-icon"/>
                      <span>Route: <strong>V2 Fast</strong></span>
                      <span className="badge badge-green">Best Route</span>
                    </div>
                    <div className="right">
                      <div className="meta">
                        <img src="./imgs/gas.svg" className="icon" alt="Gas fees"/>
                        <span>$3.20</span>
                      </div>
                      <div className="meta">
                        <img src="./imgs/time.svg" className="icon" alt="Duration"/>
                        <span>~{estimatedDuration} seconds</span>
                      </div>
                    </div>
                  </div>


                  <div className="divider" style={{margin: "25px 0px"}}></div>

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
                      <img src="./imgs/usdc-icon.svg" alt="USDC" className="usdc-icon"/>
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
            <div className="right" style={{width: "calc(100% - 50% - 30px)", marginLeft: "30px"}}>
              <div className="sidebar">
                <ul className="tabs">
                  <li className="active">My Portfolio</li>
                  <li>History</li>
                </ul>
                <div className="sidebar-content">
                  <p style={{textAlign: "center", padding: "260px 0px", opacity: ".6"}}>Portfolio view goes here..</p>
                </div>
              </div>
            </div>
          </div>

          <footer>
            <div className="left">
            </div>
            <div className="right">
              <ul>
                <li><a href="https://x.com/stable_io" target="_blank"><button className="social-media-btn"><img src="./imgs/x-logo.svg" alt="" style={{width: "12px", height: "12px"}}/></button></a></li>
              </ul>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}
