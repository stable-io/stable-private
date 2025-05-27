import { EventEmitter } from "node:events";
import { TransferProgressEventEmitter } from "./types/index.js";

export class TransferProgressEmitter extends (EventEmitter as { new(): TransferProgressEventEmitter }) {

}