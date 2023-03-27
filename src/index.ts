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
        if(!file.trim())
            throw new Error("Invalid argument: file must be a non-empty string");

        this.file = file;
    }

    addWord(word: string) {
        if(!word.trim())
            throw new Error("Invalid argument: word must be a non-empty string");

        if (this.words.includes(word))
            return;
        this.words.push(word);
        if(this.instance instanceof WordCounterSDKListeners) {
            this.instance.addWords(this.words);
        }
    }

    setWords(words: string[]) {
        if(!words || !words.length)
            throw new Error("Invalid param: words must be an array with at least one word.");

        const newWords = [...new Set([...this.words, ...words])];
        this.words = newWords;
        if(this.instance instanceof WordCounterSDKListeners) {
            this.instance.addWords(this.words);
        }
    }

    deleteWord(word: string) {
        if(!word)
            throw new Error("Invalid argument: word must be a non-empty string");

        this.words = this.words.filter(_word => _word !== word);
        if(this.instance instanceof WordCounterSDKListeners) {
            this.instance.addWords(this.words);
        }
    }

    async findWords() {
        if(!this.file)
            throw new Error('No file URL provided.');
        
        if(!this.words.length)
            throw new Error('No words to find provided.');

        if(this.instance instanceof WordCounterSDKListeners) {
            this.instance.start();
        }
        const response = await fetch(this.file);
        if(!response || !response.body)
            throw new Error('Failed to fetch file.');
            
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

        if(this.instance instanceof WordCounterSDKListeners) {
            this.instance.finish();
        }
    }
    
    getTotal() {
        if(!this.instance)
            throw new Error('WordCounterSDK instance is not initialized');

        return this.instance.getTotal();
    }
    
    reset() {
        if(!this.instance)
            throw new Error('WordCounterSDK instance is not initialized');

        this.words = [];
        this.previousChunk = null;
        this.instance.resetTotal;
    }
    
    subscribeToEvents(callback: IWordCounterSDKListeners) {
        if(this.instance instanceof WordCounterSDKListeners) {
            this.instance.subscribeToEvents(callback);
            return;
        }
        throw new Error("This method can only be used with WordCounterSDKListeners instance");
    }
    
    unsubscribeToEvents(callback: IWordCounterSDKListeners) {
        if(this.instance instanceof WordCounterSDKListeners) {
            this.instance.unsubscribeToEvents(callback);
            return;
        }
        throw new Error("This method can only be used with WordCounterSDKListeners instance");
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
                this.total += matches.length;
                this.publishOnWordFound(matches.length);
            }
        })
    }

    addWords(words: string[]) {
        this.publishOnAddWord(words);
    }

    start() {
        this.publishOnStart();
    }

    finish() {
        this.publishOnFinish();
    }

    getTotal = () => this.total;

    resetTotal = () => this.total = 0;

    subscribeToEvents(callback: IWordCounterSDKListeners) {
        this.suscribers.push(callback);
    }

    unsubscribeToEvents(callback: IWordCounterSDKListeners) {
        let index = this.suscribers.indexOf(callback);
        if(index !== -1) this.suscribers.splice(index, 1);
    }

    protected publishOnAddWord(word: string[]) {
        this.suscribers.forEach((listener) => listener.onAddWord?.(word));
    }

    protected publishOnWordFound(wordsFound: number) {
        this.suscribers.forEach((listener) => listener.onWordFound?.(wordsFound));
    }
    
    protected publishOnStart() {
        this.suscribers.forEach((listener) => listener.onStart?.());
    }

    protected publishOnFinish() {
        this.suscribers.forEach((listener) => listener.onFinish?.());
    }
}

// No listeners class
class WordCounterSDKWithoutListeners implements IWordCounterSDKSharedFunctions {
    private total = 0;

    checkWords(words: string[],text: string) {
        words.forEach((word) => {
            let regex = new RegExp(`\\b${word}\\b`, 'g');
            let matches = text.match(regex);
            if(matches && matches.length)
                this.total += matches.length;
        })
    }

    getTotal = () => this.total;

    resetTotal = () => this.total = 0;
}
