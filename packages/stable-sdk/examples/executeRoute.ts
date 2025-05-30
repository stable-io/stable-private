// Copyright (c) 2025 Stable Technologies Inc
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { ViemSigner } from "../src/signer/viemSigner.js";
import { privateKeyToAccount } from "viem/accounts";
import StableSDK from "../src/index.js";
import { Address } from "viem";
import dotenv from "dotenv";
import { EvmDomains } from "@stable-io/cctp-sdk-definitions";
import { ViemEvmClient } from "@stable-io/cctp-sdk-viem";

dotenv.config();
const privateKey = process.env.EVM_PRIVATE_KEY as Address;
const account = privateKeyToAccount(privateKey);

const sender = account.address;
const recipient = account.address;

const rpcUrls = {
  Ethereum: "https://ethereum-sepolia.rpc.subquery.network/public",
};

const sdk = new StableSDK({
  network: "Testnet",
  signer: new ViemSigner(account),
  rpcUrls,
});

const intent = {
  sourceChain: "Ethereum" as const,
  targetChain: "Optimism" as const,
  amount: "0.01",
  sender,
  recipient,
  gasDropoffDesired: 0n,
};

const routes = await sdk.findRoutes(intent, { paymentToken: "usdc" });

console.info(`Transfers from ${intent.sourceChain} to ${intent.targetChain}.`);
console.info(`Sender: ${sender}`);
console.info(`Recipient: ${recipient}`);

const selectedRoutes = [routes.all[3]];

for (const route of selectedRoutes) {
  const hasBalance = await sdk.checkHasEnoughFunds(route);
  if (!hasBalance) {
    console.info(`${route.intent.sender} doesn't have enough balance to pay for the transfer`);
    continue;
  }
  console.info("--------------------------------");
  console.info("");
  console.info("");
  console.info(`Routing through corridor: ${route.corridor}`);
  console.info(
    "Token Authorization To use:",
    route.requiresMessageSignature ? "Permit" : "Approval",
  );
  console.info("Signatures required", route.steps.length);
  console.info(
    `Total Cost: $${route.estimatedTotalCost.toUnit("human").toString()}`,
  );
  console.info(`Estimated Duration: ${route.estimatedDuration}s`);

  console.info("Fees to pay:");

  for (const fee of route.fees) {
    console.info(`    ${fee}`);
  }

  console.info("Executing route...");
  const {
    transactions,
    attestations,
    redeems,
    transferHash,
    redeemHash,
  } = await sdk.executeRoute(route);

  console.info(`Transfer Sent:`, transferHash);
  console.info(`Transfer Redeemed:`, redeemHash);
}
