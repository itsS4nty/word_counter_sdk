# Word Counter SDK

This library provides different methods to read text and count the total number of words efficiently.

## Methods

`constructor(listeners: boolean)`: Creates an SDK instance and sets whether listeners will be used or not.

`addWord(word: string)`: Adds a word to the list of words to search for. If the instance was created with listeners, it also publishes the updated list of words.

`setFile(file: string)`: Sets the file in which the words will be searched.

`setWords(words: string[])`: Sets the list of words to search for. If the instance was created with listeners, it also publishes the updated list of words.

`findWords()`: Searches for words in the previously set file and counts how many times each word appears in the file. If the instance was created with listeners, it also publishes the search progress.

`getTotal()`: Returns the total occurrences of the searched words in the file.

`reset()`: Resets the SDK instance to its initial state. If the instance was created with listeners, it also publishes the instance reset.

`subscribeToEvents(listener: IWordCounterSDKListeners)`: Adds a listener to receive search progress events and instance reset events.

`unsubscribeToEvents(listener: IWordCounterSDKListeners)`: Removes a previously added listener.

It should be noted that the subscribeToEvents() and unsubscribeToEvents() functions can only be used if an SDK instance has been created with listeners.

## Test

I decided to add tests to ensure that the library works correctly in different situations and scenarios. Tests allow me to make sure that the functions behave as expected, and if changes are made in the future, I can verify that everything still works correctly.

The tests I created are unit tests that cover all the main functions of the library. I use Jest as a testing framework and have created different tests for each function, ensuring that all possible cases and usage scenarios are covered.

With these tests, I have been able to detect and correct errors and failures in the library before they occur in the application. Also, they give me confidence that the library works correctly and error-free, allowing me to safely implement it in any future project.

In summary, tests are an essential tool to ensure that the library works correctly and without errors. They allow me to verify that the functions behave as expected and correct any errors before they occur in the application

## Example of use
### main.ts
```
// Import the WordCounterSDK library
import { WordCounterSDK } from 'word_counter_sdk_lib/dist';

// Create a new instance of WordCounterSDK
const word_count_sdk: WordCounterSDK = new WordCounterSDK(false);

// Set the file URL to search for words
word_count_sdk.setFile('https://domain.com/book_rute.txt');
// Set the list of words to search for
word_count_sdk.setWords(['test', 'words', 'to', 'find']);
// Perform the word search
word_count_sdk.findWords();

// Display the total number of words found
console.log(`Total words found: ${word_count_sdk.getTotal()}`);
```
