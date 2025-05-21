import Head from "next/head";
import Link from "next/link";

export default function Home() {
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
                            <span>Ethereum</span>
                            <img src="./imgs/arrow-down.svg" alt="" className="arrow"/>
                          </div>
                          <div className="select-menu">
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
                          </div>
                        </div>
                      </div>
                      <div className="right">
                        <div className="wallet-chip">
                          <img src="./imgs/metamask-logo.svg" alt="MetaMask" className="wallet-icon"/>
                          <span className="address">0x60...62da</span>
                          <button className="edit-btn">Edit</button>
                        </div>
                        <div className="balance">
                          <span>Balance: 4,500.32 USDC</span>
                        </div>

                      </div>
                    </div>

                    <div className="amount-section">
                      <img src="./imgs/usdc-icon.svg" alt="USDC" className="usdc-icon"/>
                      <input type="text" value="2,410" placeholder="Enter amount"/>
                      <button className="max-button">MAX</button>
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
                            <img src="./imgs/op-logo.svg" className="network-logo" alt="Ethereum"/>
                            <span>Optimism</span>
                            <img src="./imgs/arrow-down.svg" alt="" className="arrow"/>
                          </div>
                        </div>
                      </div>
                      <div className="right">
                        <div className="wallet-chip">
                          <img src="./imgs/metamask-logo.svg" alt="MetaMask" className="wallet-icon"/>
                          <span className="address">0x60...62da</span>
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
                      <span>Route: <strong>AvaxHop</strong></span>
                      <span className="badge badge-green">Best Route</span>
                    </div>
                    <div className="right">
                      <div className="meta">
                        <img src="./imgs/gas.svg" className="icon" alt="Gas fees"/>
                        <span>$3.20</span>
                      </div>
                      <div className="meta">
                        <img src="./imgs/time.svg" className="icon" alt="Duration"/>
                        <span>~90s</span>
                      </div>
                    </div>
                  </div>


                  <div className="divider" style={{margin: "25px 0px"}}></div>

                  <div className="summary">
                    <div className="row">
                      <span className="label">Estimated time</span>
                      <span className="value">~24 seconds</span>
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
                      2,408 USDC
                      </span>
                    </div>
                  </div>

                  <div className="main-cta-container">
                    <button className="main-cta">
                      <div className="spinner"></div>
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
