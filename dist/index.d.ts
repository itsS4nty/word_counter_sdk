import { IWordCounterSDKListeners } from "./interfaces/IWordCounterSDKListeners";
import { IWordCounterSDKSharedFunctions } from "./interfaces/IWordCounterSDKSharedFunctions";
export declare class WordCounterSDK {
    private file;
    protected words: string[];
    private previousChunk;
    protected instance: WordCounterSDKListeners | WordCounterSDKWithoutListeners | null;
    constructor(useListeners: boolean);
    setFile(file: string): void;
    addWord(word: string): void;
    setWords(words: string[]): void;
    deleteWord(word: string): void;
    findWords(): Promise<void>;
    getTotal(): number | undefined;
    reset(): void;
    subscribeToEvents(callback: IWordCounterSDKListeners): void;
    unsubscribeToEvents(callback: IWordCounterSDKListeners): void;
    private analyzeChunk;
}
declare class WordCounterSDKListeners implements IWordCounterSDKSharedFunctions {
    private suscribers;
    private total;
    checkWords(words: string[], text: string): void;
    addWords(words: string[]): void;
    start(): void;
    finish(): void;
    getTotal: () => number;
    subscribeToEvents(callback: IWordCounterSDKListeners): void;
    unsubscribeToEvents(callback: IWordCounterSDKListeners): void;
    protected publishOnAddWord(word: string[]): void;
    protected publishOnWordFound(wordsFound: number): void;
    protected publishOnStart(): void;
    protected publishOnFinish(): void;
}
declare class WordCounterSDKWithoutListeners implements IWordCounterSDKSharedFunctions {
    private total;
    checkWords(words: string[], text: string): void;
    getTotal: () => number;
}
export {};
