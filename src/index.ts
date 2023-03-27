import { IWordCounterSDKListeners } from "./interfaces/IWordCounterSDKListeners";
import { IWordCounterSDKSharedFunctions } from "./interfaces/IWordCounterSDKSharedFunctions";

export class WordCounterSDK {
    private file: string = '';
    protected words: string[] = [];
    private previousChunk: string | null = null;
    protected instance: WordCounterSDKListeners | WordCounterSDKWithoutListeners | null = null;

    constructor(useListeners: boolean) {
        if(useListeners) {
            this.instance = new WordCounterSDKListeners();
            return;
        }
        this.instance = new WordCounterSDKWithoutListeners();
    }

    setFile(file: string) {
        if(!file) return;
        this.file = file;
    }

    addWord(word: string) {
        if(!word) return;
        this.words.push(word);
    }

    setWords(words: string[]) {
        if(!words || !words.length) return;
        this.words = [...this.words, ...words];
    }

    async findWords() {
        if(!this.file) return;
        const response = await fetch(this.file);
        if(!response || !response.body) return;
        const reader = response.body.getReader();

        let result = await reader.read();
        let chunk = result.value;

        while(!result.done) {
            const decoder = new TextDecoder();
            const text = decoder.decode(chunk);

            this.analyzeChunk(text.toLowerCase());

            result = await reader.read();
            chunk = result.value;
        }
    }

    getTotal() {
        if(!this.instance) return;
        return this.instance.getTotal();
    }

    subscribeToEvents(callback: IWordCounterSDKListeners) {
        if(this.instance instanceof WordCounterSDKListeners) {
            this.instance.subscribeToEvents(callback);
            return;
        }
        throw new Error("Can't use this method on non listeners instance");
    }
    
    unsubscribeToEvents(callback: IWordCounterSDKListeners) {
        if(this.instance instanceof WordCounterSDKListeners) {
            this.instance.unsubscribeToEvents(callback);
            return;
        }
        throw new Error("Can't use this method on non listeners instance");
    }

    private analyzeChunk(chunk: string) {
        if(!this.instance) return;
        let words = chunk.split(/\b/);
        if(this.previousChunk && this.previousChunk.trim()) {
            words[0] = this.previousChunk + words[0];
            this.previousChunk = null;
        }
        if(words.length === 1) {
            this.instance.checkWords(this.words, words.join(''));
            return;
        }
        if(words[words.length - 1] && words[words.length - 1].trim()) {
            this.previousChunk = words[words.length - 1];
            words.pop();
        }
        chunk = words.join('');
        this.instance.checkWords(this.words, chunk);
    }
}

// Listeners class
class WordCounterSDKListeners implements IWordCounterSDKSharedFunctions {
    private suscribers: IWordCounterSDKListeners[] = [];
    private total = 0;

    checkWords(words: string[], text: string) {
        words.forEach((word) => {
            let regex = new RegExp(`\\b${word}\\b`, 'g');
            let matches = text.match(regex);
            if(matches && matches.length) {
                // Quitar el total cuando este todo acabado
                this.total += matches.length;
                this.publishOnWordFound(matches.length);
            }
        })
    }

    getTotal = () => this.total;

    subscribeToEvents(callback: IWordCounterSDKListeners) {
        this.suscribers.push(callback);
    }

    unsubscribeToEvents(callback: IWordCounterSDKListeners) {
        let index = this.suscribers.indexOf(callback);
        if(index !== -1) this.suscribers.splice(index, 1);
    }

    protected publishOnWordFound(wordsFound: number) {
        this.suscribers.forEach((listener) => listener.onWordFound?.(wordsFound));
    }
}

// No listeners class
class WordCounterSDKWithoutListeners implements IWordCounterSDKSharedFunctions {
    private total = 0;

    checkWords(words: string[],text: string) {
        words.forEach((word) => {
            let regex = new RegExp(`\\b${word}\\b`, 'g');
            let matches = text.match(regex);
            if(matches && matches.length) {
                // Quitar el total cuando este todo acabado
                this.total += matches.length;
            }
        })
    }

    getTotal = () => this.total;
}
