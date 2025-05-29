import { EventEmitter } from "node:events";
import { encoding } from "@stable-io/utils";
import { Permit } from "@stable-io/cctp-sdk-evm";
import { Hex } from "./types/index.js";
import { CctpAttestation } from "./methods/executeRoute/findTransferAttestation.js";
import { Redeem } from "./types/redeem.js";

export class TransferProgressEmitter extends (EventEmitter as { new(): TransferProgressEventEmitter }) {
  emit<K extends keyof TransferProgressEvent>(event: K, payload: TransferProgressEvent[K]): boolean {
    const result = super.emit(event, payload);
    if (!result) {
      super.emit('step-completed', { name: event, data: payload });
    }
    return result;
  }
}

export interface TransferProgressEventEmitter extends EventEmitter {
  on<K extends keyof TransferProgressEvent>(event: K, listener: (payload: TransferProgressEvent[K]) => void): this;
  emit<K extends keyof TransferProgressEvent>(event: K, payload: TransferProgressEvent[K]): boolean;
}

// events related to the steps of the transfer, not necessarily
// transactions.
export interface TransferProgressEvent {

  // Approval:
  "permit-signed": PermitSignedEventData;
  "approval-sent": ApprovalSentEventData;

  // Transfer:
  "transfer-sent": TransferSentEventData;

  "transfer-confirmed": TransferConfirmedEventData;

  "hop-redeemed": HopRedeemedEventData;

  "hop-confirmed": HopConfirmedEventData;

  "transfer-redeemed": TransferRedeemedEventData;

  // Catch all:
  "step-completed": StepCompletedEventData<keyof TransferProgressEvent>;
}

/**
 * Transfer Life Cycle Events
 */

/**
 * Approval:
 */
export type PermitSignedEventData = Omit<Permit, "signature"> & {
  signature: Hex;
};

export function parsePermitEventData(permit: Permit): PermitSignedEventData {
  return {
    ...permit,
    signature: `0x${encoding.hex.encode(permit.signature)}`,
  }
};

export type ApprovalSentEventData = {
  transactionHash: Hex;
  approvalAmount: bigint;
};

/**
 * Transfer:
 */

export type TransferSentEventData = {
  transactionHash: Hex;
  approvalType: "Permit" | "Preapproval" | "Gasless",
  gasDropOff: bigint;
  usdcAmount: number;
  recipient: Hex;
  quoted: "onChainUsdc" | "onChainGas" | "offChain";
};

export type TransferConfirmedEventData = CctpAttestation;

export type TransferRedeemedEventData = Redeem;

/**
 * Hop:
 */
export type HopRedeemedEventData = Redeem;

export type HopConfirmedEventData = CctpAttestation;

/**
 * Catch all:
 */
export interface StepCompletedEventData<K extends keyof TransferProgressEvent> {
  name: K;
  data: TransferProgressEvent[K];
}
