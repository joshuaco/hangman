import prompt from 'readline-sync'; // <----- ESTA ES UNA LIBRERIA
import wordBank from './word-bank.js';

const maxAttempts = 6; // intentos permitidos

let wordToGuess = '';
let attemptsLeft = 0;
let wins = 0;
let losses = 0;
let lettersGuessed = []; // <---- se van almacenar las letras que el usuario ha colocado.

const startGame = () => {
  console.log('\nWelcome to Hangman!\nPress ctrl+c to stop\n');

  // Initialize attempts and generate random word
  attemptsLeft = maxAttempts;
  wordToGuess = getRandomWord(wordBank); // wordToGuess = "chorus"

  // Print the initial state of the game
  initializeDisplay();
  //console.log(wordToGuess);

  while (true) {
    const letter = prompt.question('Please guess a letter: '); //Queda esperando por la letra del usuraio

    // Only accept single-letter inputs
    if (!isLetter(letter)) {
      console.log('Please enter a single letter or a valid letter');
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
    checkGuess(letter);

    // Print the current state of the game
    initializeDisplay(); //update the svcren

    // Check if the game is over
    if (isGameOver()) {
      let answer = '';
      do {
        answer = prompt.question('Do you want to play again? (y/n) > ');
        if (answer.toLowerCase() === 'y') {
          resetGame();
        }
        else if (answer.toLowerCase() === 'n') {
          console.log('Thanks for playing!');
          process.exit();
        }
        else {
          console.log('Please enter y or n');
        }

      } while (answer.toLowerCase() !== 'y' && answer.toLowerCase() !== 'n');
    }
  }
};

// Select a random word from the list
const getRandomWord = (wordBank) => {
  return wordBank[Math.floor(Math.random() * wordBank.length)];
};

// Returns a masked word with '_' or the letter guessed
const getMaskedWord = (word) => {
  // chorus
  let maskedWord = '';

  for (let letter of word) {
    // chorus => [c, h, o, r, u, s]
    if (lettersGuessed.includes(letter)) {
      //[o, c] => lettersGuessed
      maskedWord += letter; // c
    } else {
      maskedWord += '_'; // c _
    }
    //maskedWord += " "; // Para separar guiones
  }
  return maskedWord;
};

const isLetter = (input) => {
  // 5
  return input.length === 1 && /^[a-zA-Z]+$/.test(input); //false
};

const checkGuess = (input) => {
  console.clear();
  if (wordToGuess.includes(input)) {
    console.log(`\nCorrect! "${input}" is in the word.\n`);
  } else {
    console.log(`\nsorry, "${input}" is not in the word.\n`);
    attemptsLeft--;
  }
};

const initializeDisplay = () => {
  scoreBoard();
  console.log(`Word: ${getMaskedWord(wordToGuess)}`); // Word: ____
  console.log(`Attempts left: ${attemptsLeft}`); // Attempts left: 6
  console.log(`Letters Guessed: ${lettersGuessed.join(', ')}`); // Letters Guessed []
};

const scoreBoard = () => {
  if (wins > 0 || losses > 0) {
    console.log(`Wins: ${wins} \t Losses: ${losses}\n`);
  }
}

const isGameOver = () => {
  if (attemptsLeft === 0) {
    console.log(`Game Over! The word was "${wordToGuess}".`);
    losses++;
    return true;
  } else if (wordIsGuessed()) {
    console.log(`Congrats! you guessed the word "${wordToGuess}".`);
    wins++;
    return true;
  }
  return false;
};

const wordIsGuessed = () => {
  return getMaskedWord(wordToGuess) === wordToGuess; // ca_a === casa => false
};

const resetGame = () => {
  attemptsLeft = maxAttempts; // 6
  wordToGuess = getRandomWord(wordBank);
  lettersGuessed = [];
  console.clear();
  initializeDisplay();
};

startGame();
