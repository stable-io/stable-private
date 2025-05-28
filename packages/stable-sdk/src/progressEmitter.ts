import { EventEmitter } from "node:events";

export class TransferProgressEmitter extends (EventEmitter as { new(): TransferProgressEventEmitter }) {
  emit<K extends keyof TransferProgressEvent>(event: K, payload: TransferProgressEvent[K]): boolean {
    const result = super.emit(event, payload);
    if (result) {
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
export type PermitSignedEventData = {

};

export type ApprovalSentEventData = {

};

/**
 * Transfer:
 */

export type TransferSentEventData = {

};

export type TransferConfirmedEventData = {

};

export type TransferRedeemedEventData = {

};

/**
 * Hop:
 */
export type HopRedeemedEventData = {

};

export type HopConfirmedEventData = {

};

/**
 * Catch all:
 */
export interface StepCompletedEventData<K extends keyof TransferProgressEvent> {
  name: K;
  data: TransferProgressEvent[K];
}
