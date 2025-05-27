import { EventEmitter } from "node:events";

export class TransactionEmitter extends (EventEmitter as { new(): TransactionEventEmitter }) {

}

export interface TransactionEventEmitter extends EventEmitter {
  on<K extends keyof TransactionEvents>(event: K, listener: (payload: TransactionEvents[K]) => void): this;
  emit<K extends keyof TransactionEvents>(event: K, payload: TransactionEvents[K]): boolean;
}

// events related directly to the blockchain transactions we manage
// in execute route.
interface TransactionEvents {
  "transaction-sent": TxSentEventData;
  "transaction-included": TxIncludedEventData;
}

export type TxIncludedEventData = {

}

export type TxSentEventData = {

}
