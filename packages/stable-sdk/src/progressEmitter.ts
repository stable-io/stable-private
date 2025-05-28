import { EventEmitter } from "node:events";

export class TransferProgressEmitter extends (EventEmitter as { new(): TransferProgressEventEmitter }) {

}

export interface TransferProgressEventEmitter extends EventEmitter {
  on<K extends keyof TransferProgressEvent>(event: K, listener: (payload: TransferProgressEvent[K]) => void): this;
  emit<K extends keyof TransferProgressEvent>(event: K, payload: TransferProgressEvent[K]): boolean;
}

// events related to the steps of the transfer, not necessarily
// transactions.
export interface TransferProgressEvent {

  // step 1 (non might be present).
  "permit-signed": PermitSignedEventData;
  "approval-sent": ApprovalSentEventData;

  // step 2
  "transfer-sent": TransferSentEventData;

  // step 3
  "transfer-confirmed": TransferConfirmedEventData;

  // step 4
  "transfer-redeemed": TransferRedeemedEventData;
}

/**
 * Transfer Life Cycle Events
 */

export type PermitSignedEventData = {

};

export type ApprovalSentEventData = {

};

export type TransferSentEventData = {

};

export type TransferConfirmedEventData = {

};

export type TransferRedeemedEventData = {

};
