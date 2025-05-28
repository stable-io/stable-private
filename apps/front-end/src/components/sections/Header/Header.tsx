import Image from "next/image";
import Link from "next/link";

export const Header = () => (
  <div test-id="eader" className="top-nav">
    <div className="left">
      <Link href="/">
        <h1 className="logo"></h1>
      </Link>
    </div>
    <div className="right">
      <ul className="nav">
        <li className="active">
          <a href="#">USDC Bridge</a>
        </li>
        <li>
          <a href="#">Stable SDK</a>
        </li>
        <li>
          <a href="#">Why Stable</a>
        </li>
        <li>
          <a href="mailto:hello@stable.io">Reach out</a>
        </li>
      </ul>
      <button className="hamburger-menu">
        <Image
          src="/imgs/hamburger-menu.svg"
          alt=""
          unoptimized
          height={20}
          width={20}
        />
      </button>
    </div>
  </div>
);
