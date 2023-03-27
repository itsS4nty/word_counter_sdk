import { WordCounterSDK } from '../src/index';
import { IWordCounterSDKListeners } from '../src/interfaces/IWordCounterSDKListeners';

describe('WordCounterSDKListeners', () => {
	let wordCounterSDK: WordCounterSDK;
	const words = ['word1', 'word2', 'word3'];

	beforeEach(() => {
		wordCounterSDK = new WordCounterSDK(true);
	});

	it('should add a word to the words array', () => {
		wordCounterSDK.addWord('test');
		expect(wordCounterSDK['words']).toContain('test');
	});
	it('should set the file property when called with a non-empty string', () => {
        const file = '/books/dracula.txt';
		wordCounterSDK.setFile(file);
		expect(wordCounterSDK['file']).toBe(file);
	});
	it('should not set the file and word property when called with an empty string', () => {
        expect(() => wordCounterSDK.addWord('')).toThrow();
        expect(() => wordCounterSDK.setFile('')).toThrow();
	});
	it('should add a word to the words array when addWord is called with a string', () => {
		wordCounterSDK.addWord('word4');
		expect(wordCounterSDK['words']).toContain('word4');
	});
    it('should add an array of words to the words array when setWords is called with an array of strings', () => {
        wordCounterSDK.setWords(words);
        expect(wordCounterSDK['words']).toEqual(expect.arrayContaining(words));
    });
	it('shouldn\'t add the word "word2" twice to the words array when addWord is called with a string because it exists', () => {
		wordCounterSDK.setWords(words);
        wordCounterSDK.addWord('word2');
		expect(wordCounterSDK['words']).toEqual(['word1', 'word2', 'word3']);
		expect(wordCounterSDK['words']).not.toEqual(['word1', 'word2', 'word3', 'word2']);
	});
    it('should remove a word from the words array when deleteWord is called with a string', () => {
        wordCounterSDK['words'] = words;
        wordCounterSDK.deleteWord('word2');
        expect(wordCounterSDK['words']).toEqual(expect.not.arrayContaining(['word2']));
    });
    it('should set the previousChunk property to null when reset is called', () => {
        wordCounterSDK['previousChunk'] = 'chunk';
        wordCounterSDK.reset();
        expect(wordCounterSDK['previousChunk']).toBeNull();
    });
    it('should return the correct total count of found words', async () => {
        const wordCounterSDK = new WordCounterSDK(true);
        const words = ['content', 'females', 'as'];
        wordCounterSDK.setFile('https://example-files.online-convert.com/document/txt/example.txt');
        wordCounterSDK.setWords(words);
        await wordCounterSDK.findWords();
        expect(wordCounterSDK.getTotal()).toBe(11);
    });
    it('should throw an error when subscribeToEvents or unsubscribeToEvents is called on an instance of WordCounterSDKWithoutListeners', () => {
        const sdk = new WordCounterSDK(false);
        expect(() => sdk.subscribeToEvents({} as IWordCounterSDKListeners)).toThrow();
        expect(() => sdk.unsubscribeToEvents({} as IWordCounterSDKListeners)).toThrow();
    });
});
