// Copyright (c) 2025 Stable Technologies Inc
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { Chain as ViemChain, Account as ViemAccount, parseAbiItem, decodeFunctionData } from "viem";

import { Permit, ContractTx, CallData } from "@stable-io/cctp-sdk-evm";
import { ViemEvmClient } from "@stable-io/cctp-sdk-viem";
import type { Network, EvmDomains } from "@stable-io/cctp-sdk-definitions";
import { evmGasToken } from "@stable-io/cctp-sdk-definitions";
import { encoding } from "@stable-io/utils";
import { parseTransferTxCalldata } from "@stable-io/cctp-sdk-cctpr-evm";
import { isContractTx, Route, getStepType, isEip2612Data, ViemWalletClient, TxHash, Hex } from "../../types/index.js";
import { ApprovalSentEventData, TransferSentEventData, parsePermitEventData } from "../../progressEmitter.js";

const fromGwei = (gwei: number) => evmGasToken(gwei, "nEvmGasToken").toUnit("atomic");

export async function executeRouteSteps<N extends Network, D extends keyof EvmDomains>(
  network: N, route: Route, signer: ViemWalletClient, client: ViemEvmClient<N, D>
): Promise<TxHash[]> {
  const txHashes = [] as string[];
  let permit: Permit | undefined = undefined;
  while (true) {
    const { value: txOrSig, done } = await route.workflow.next(permit);
    permit = undefined;

    const stepType = getStepType(txOrSig);

    if (stepType !== "sign-permit" && isContractTx(txOrSig)) {
      const tx = await signer.sendTransaction(
        buildEvmTxParameters(txOrSig, signer.chain!, signer.account!),
      );

      route.transactionListener.emit("transaction-sent", tx);

      const receipt = await client.client.waitForTransactionReceipt({ hash: tx });
      txHashes.push(tx);

      route.transactionListener.emit("transaction-included", receipt);


      const { eventName, eventData } = buildTransactionEventData(network, stepType, txOrSig, tx);
      route.progress.emit(eventName, eventData);

    } else if (stepType === "sign-permit" && isEip2612Data(txOrSig)) {
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

      route.progress.emit("permit-signed", parsePermitEventData(permit));
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


function buildTransactionEventData(
  network: Network,
  stepType: "pre-approve" | "transfer",
  contractTx: ContractTx,
  txHash: Hex,
): {
  eventName: "approval-sent";
  eventData: ApprovalSentEventData;
} | {
  eventName: "transfer-sent";
  eventData: TransferSentEventData;
} {

  if (stepType === "pre-approve") {
    return { eventName: "approval-sent", eventData: parseApprovalTransactionEventData(contractTx, txHash) };
  } else if (stepType === "transfer") {
    return { eventName: "transfer-sent", eventData: parseTransferTransactionEventData(network, contractTx, txHash) };
  }

  // never.
  throw new Error(`Unknown step type: ${stepType}`);
}

const approveAbi = parseAbiItem("function approve(address, uint256) view returns (bool)");

function parseApprovalTransactionEventData (contractTx: ContractTx, txHash: Hex): ApprovalSentEventData {
  const callData = `0x${Buffer.from(contractTx.data).toString("hex")}` as const;
  const approvalAmount = decodeFunctionData({
    abi: [approveAbi],
    data: callData,
  }).args[1];

  return {
    transactionHash: txHash,
    approvalAmount,
  };
}

function parseTransferTransactionEventData (network: Network, contractTx: ContractTx, txHash: Hex): TransferSentEventData {
  const transferData = parseTransferTxCalldata(network)(contractTx.data);
  // there's plenty other params on the call data we could extract if we wished to.
  return {
    transactionHash: txHash,
    approvalType: transferData.approvalType,
    gasDropOff: BigInt(transferData.gasDropoff.toUnit("aGasToken").toString()),
    usdcAmount: transferData.inputAmountUsdc.toUnit("human").toNumber(),
    recipient: `0x${encoding.hex.encode(transferData.mintRecipient.unwrap())}`,
    quoted: transferData.quoteVariant.type,
  };
}