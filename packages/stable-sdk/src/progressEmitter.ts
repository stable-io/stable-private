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

  // step 1 (non might be present).
  "permit-signed": PermitSignedEventData;
  "approval-sent": ApprovalSentEventData;

  // step 2
  "transfer-sent": TransferSentEventData;

  // step 3
  "transfer-confirmed": TransferConfirmedEventData;

  // step 4
  "transfer-redeemed": TransferRedeemedEventData;

  "step-completed": StepCompletedEventData<keyof TransferProgressEvent>;
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

export interface StepCompletedEventData<K extends keyof TransferProgressEvent> {
  name: K;
  data: TransferProgressEvent[K];
}
