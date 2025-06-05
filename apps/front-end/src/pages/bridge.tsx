import Head from "next/head";
import { useState } from "react";
import type { ReactElement } from "react";

import {
  BridgeLayout,
  TopSection,
  LeftSection,
  RightSection,
  TransferStatusAlert,
  BridgeWidget,
  PortfolioSidebar,
} from "@/components";
import type { AvailableChains, GasDropoffLevel } from "@/constants";
import { availableChains } from "@/constants";
import { useBalance, useRoutes } from "@/hooks";
import { useStableContext } from "@/providers";
import type { NextPageWithLayout } from "@/utils";

const Bridge: NextPageWithLayout = (): ReactElement => {
  const [amount, setAmount] = useState(0);
  const [gasDropoffLevel, setGasDropoffLevel] =
    useState<GasDropoffLevel>("zero");
  const [sourceChain, setSourceChain] = useState<AvailableChains>(
    availableChains[0],
  );
  const [targetChain, setTargetChain] = useState<AvailableChains>(
    availableChains[1],
  );
  const [isInProgress, setIsInProgress] = useState(false);
  const [txHash, setTxHash] = useState<string | undefined>();

  const { address, stable } = useStableContext();
  const { balance, updateBalance } = useBalance({ sourceChain });
  const { route } = useRoutes({
    sourceChain,
    targetChain,
    amount,
    gasDropoffLevel,
  });

  const estimatedDuration = route?.estimatedDuration.toString(10) ?? "??";

  // @todo: Subtract expected fees
  // const maxAmount = balance;
  // const handleMaxAmount = () => {
  //   setAmount(maxAmount);
  // };

  const handleSelectSourceChain = (chain: AvailableChains): void => {
    setSourceChain(chain);
    if (targetChain === chain) {
      setTargetChain(sourceChain);
    }
  };

  const handleSelectTargetChain = (chain: AvailableChains): void => {
    setTargetChain(chain);
    if (sourceChain === chain) {
      setSourceChain(targetChain);
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newAmount = Number.parseFloat(e.target.value) || 0;
    setAmount(newAmount);
  };

  const handleTransfer = (): void => {
    if (!route || !stable) {
      return;
    }
    setIsInProgress(true);
    setTxHash(undefined);
    stable
      .executeRoute(route)
      .then(({ transferHash }) => {
        setTxHash(transferHash);
        void updateBalance();
      })
      .catch((error: unknown) => {
        console.error(error);
      })
      .finally(() => {
        setIsInProgress(false);
      });
  };

  return (
    <>
      <Head>
        <title>
          Stable | Move USDC across networks with high speed and minimal costs
        </title>
      </Head>
      {txHash && (
        <TopSection>
          <TransferStatusAlert txHash={txHash} targetChain={targetChain} />
        </TopSection>
      )}
      <LeftSection>
        <BridgeWidget
          amount={amount}
          onAmountChange={handleAmountChange}
          gasDropoffLevel={gasDropoffLevel}
          onGasDropoffLevelSelect={setGasDropoffLevel}
          sourceChain={sourceChain}
          onSelectSourceChain={handleSelectSourceChain}
          targetChain={targetChain}
          onSelectTargetChain={handleSelectTargetChain}
          availableChains={availableChains}
          walletAddress={address}
          balance={balance}
          route={route}
          estimatedDuration={estimatedDuration}
          isInProgress={isInProgress}
          onTransfer={handleTransfer}
        />
      </LeftSection>
      <RightSection>
        <PortfolioSidebar />
      </RightSection>
    </>
  );
};

Bridge.getLayout = (page: ReactElement): ReactElement => (
  <BridgeLayout>{page}</BridgeLayout>
);

export default Bridge;
