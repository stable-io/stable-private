import { EventEmitter } from "node:events";

export class TransferProgressEmitter extends (EventEmitter as { new(): TransferProgressEventEmitter }) {

}

export interface TransferProgressEventEmitter extends EventEmitter {
  on<K extends keyof TransferProgressEvents>(event: K, listener: (payload: TransferProgressEvents[K]) => void): this;
  emit<K extends keyof TransferProgressEvents>(event: K, payload: TransferProgressEvents[K]): boolean;
}

// events related to the steps of the transfer, not necessarily
// transactions.
interface TransferProgressEvents {

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
