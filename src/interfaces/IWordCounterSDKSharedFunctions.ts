import { IWordCounterSDKListeners } from "./IWordCounterSDKListeners";

export interface IWordCounterSDKSharedFunctions {
    checkWords(words: string[], text: string): void;
    subscribeToEvents?(callback: IWordCounterSDKListeners): void;
    unsubscribeToEvents?(callback: IWordCounterSDKListeners): void;
}