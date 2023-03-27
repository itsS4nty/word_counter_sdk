export interface IWordCounterSDKListeners {
    onWordFound?(wordsFound: number): void;
    onAddWord?(word: string[]): void;
}