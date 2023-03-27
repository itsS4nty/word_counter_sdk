export interface IWordCounterSDKListeners {
    onWordFound?(wordsFound: number): void;
}