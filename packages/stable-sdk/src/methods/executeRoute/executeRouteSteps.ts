// Copyright (c) 2025 Stable Technologies Inc
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { Chain as ViemChain, Account as ViemAccount } from "viem";

import { Permit, ContractTx } from "@stable-io/cctp-sdk-evm";
import { ViemEvmClient } from "@stable-io/cctp-sdk-viem";
import type { Network, EvmDomains } from "@stable-io/cctp-sdk-definitions";
import { evmGasToken } from "@stable-io/cctp-sdk-definitions";
import { encoding } from "@stable-io/utils";
import { isContractTx, Route, getStepType, isEip2612Data, ViemWalletClient, TxHash, StepType } from "../../types/index.js";
import { TransferProgressEvent } from "src/progressEmitter.js";

const fromGwei = (gwei: number) => evmGasToken(gwei, "nEvmGasToken").toUnit("atomic");

export async function executeRouteSteps<N extends Network, D extends keyof EvmDomains>(
  route: Route, signer: ViemWalletClient, client: ViemEvmClient<N, D>
): Promise<TxHash[]> {
  const txHashes = [] as string[];
  let permit: Permit | undefined = undefined;
  while (true) {
    const { value: txOrSig, done } = await route.workflow.next(permit);
    permit = undefined;

    const stepType = getStepType(txOrSig);

    if (isContractTx(txOrSig)) {
      const tx = await signer.sendTransaction(
        buildEvmTxParameters(txOrSig, signer.chain!, signer.account!),
      );

      route.transactionListener.emit("transaction-sent", {});

      await client.client.waitForTransactionReceipt({ hash: tx });
      txHashes.push(tx);

      route.transactionListener.emit("transaction-included", {});

      const eventName = getEventNameFromStepType(stepType);
      route.progress.emit(eventName, {});

    } else if (isEip2612Data(txOrSig)) {
      const signature = await signer.signTypedData({
        account: signer.account!,
        ...txOrSig,
      });

      permit = {
        signature: Buffer.from(encoding.stripPrefix("0x", signature), "hex"),
        // It's possible to override the following values by changing them
        // before signing the message.
        // We need to pass them back to the cctp-sdk so that it can know
        // what changes we made.
        // We don't modify them rn, so we give it back what it gave us.
        value: txOrSig.message.value,
        deadline: txOrSig.message.deadline,
      };

      route.progress.emit("permit-signed", {});
    }

    if (done) break;
  }

  return txHashes;
}

function buildEvmTxParameters (tx: ContractTx, chain: ViemChain, account: ViemAccount) {
  const callData = `0x${Buffer.from(tx.data).toString("hex")}` as const;
  const txValue = tx.value
    ? BigInt(tx.value.toUnit("atomic").toString())
    : undefined;
  return {
    from: tx.from?.unwrap(),
    value: txValue,
    chain: chain,
    account: account,
    to: tx.to.unwrap(),
    data: callData,
    /**
     * @todo: Proper gas calculation will be necessary at some point...
     *        we could consider using the gasEstimation field of the corresponding step.
     */
    gas: fromGwei(0.001),
    maxFeePerGas: fromGwei(40),
    maxPriorityFeePerGas: fromGwei(15),
  };
}


function getEventNameFromStepType (stepType: StepType): keyof TransferProgressEvent {
  switch (stepType) {
    case "pre-approval":
      return "approval-sent";
    case "transfer":
      return "transfer-sent";
    default:
      throw new Error(`Unknown Event For Step Type: ${stepType}`);
  }
}