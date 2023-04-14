import prompt from 'readline-sync';
import wordBank from './word-bank.js';

const maxAttempts = 5;

let wordToGuess = '';
let attemptsLeft = 0;
let lettersGuessed = [];

const startGame = () => {
  console.log('\nWelcome to Hangman!\nPress ctrl+c to stop\n');

  // Initialize attempts and generate random word
  attemptsLeft = maxAttempts;
  wordToGuess = getRandomWord(wordBank);

  // Print the initial state of the game
  initializeDisplay();
  console.log(wordToGuess);

  while (true) {
    const letter = prompt.question('Please guess a letter: ');

    // Only accept single-letter inputs
    if (!isLetter(letter)) {
      console.log('Please enter a single letter.');
      continue;
    }

    // Check if the letter has already been guessed
    if (lettersGuessed.includes(letter)) {
      console.log('You already guessed that letter.');
      continue;
    }

    // Add the letter to the list of guessed letters
    lettersGuessed.push(letter);

    // Check if the letter is in the word
    checkLetterInWord(letter);

    // Print the current state of the game
    initializeDisplay();

    // Check if the game is over
    if (gameOver()) {
      const answer = prompt.question('Wanna play again?(y/n)');
      if (answer.toLowerCase() == 'y') {
        resetGame();
      } else {
        console.log("Thanks for played the game!");
        process.exit();
      }
    }
  }
};

// Select a random word from the list
const getRandomWord = (wordBank) => {
  return wordBank[Math.floor(Math.random() * wordBank.length)];
};

// Returns a masked word with '_'
const getMaskedWord = (word) => {
  let maskedWord = '';

  for (let letter of word) {
    if (lettersGuessed.includes(letter)) {
      maskedWord += letter;
    } else {
      maskedWord += '_';
    }
  }
  return maskedWord;
};

const isLetter = (input) => {
  return input.length === 1 && /^[a-zA-Z]+$/.test(input);
};

const checkLetterInWord = (input) => {
  console.clear();
  if (wordToGuess.includes(input)) {
    console.log(`\nCorrect! "${input}" is in the word.\n`);
  } else {
    console.log(`\nsorry, "${input}" is not in the word.\n`);
    attemptsLeft--;
  }
};

const initializeDisplay = () => {
  console.log(`Word: ${getMaskedWord(wordToGuess)}`);
  console.log(`Attempts left: ${attemptsLeft}`);
  console.log(`Letters Guessed: ${lettersGuessed.join(', ')}`);
};

const gameOver = () => {
  if (attemptsLeft === 0) {
    console.log(`Game Over! The word was "${wordToGuess}".`);
    return true;
  } else if (wordIsGuessed()) {
    console.log(`Congrats! you guessed the word "${wordToGuess}".`);
    return true;
  }
  return false;
};

const wordIsGuessed = () => {
  return getMaskedWord(wordToGuess) === wordToGuess;
};

const resetGame = () => {
  attemptsLeft = maxAttempts;
  wordToGuess = getRandomWord(wordBank);
  lettersGuessed = [];
  console.clear();
  initializeDisplay();
};

startGame();
