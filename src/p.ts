import { WordCounterSDK } from "./index";

const w = new WordCounterSDK(true);
// w.setWords(['wide']);
// w.analyzeChunk('tset sdfsd wide');
// w.analyzeChunk(' awake cositas');
// console.log(w.getTotal());
test()

async function test() {
    w.setFile('https://www.gutenberg.org/cache/epub/345/pg345.txt')
    w.addWord('awakened');
    w.setWords(['morris']);
    await w.findWords();
    console.log(w.getTotal());
}