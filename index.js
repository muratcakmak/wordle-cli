#! /usr/bin/env node
import readline from "readline";
import chalk from "chalk";
import fetch from "node-fetch";
import fs from "fs";

const dictionary = fs
  .readFileSync("./words.txt", "utf8")
  .toString()
  .split("\n");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const prompt = (query) => new Promise((resolve) => rl.question(query, resolve));

const error = chalk.bold.red;
const warning = chalk.hex("#FFA500");

const checkIfLetterExists = (guess, word) => {
  let result = new Array(5).fill("");
  let guessedWord = new Array(5).fill("⬛️");
  for (let i = 0; i < guess.length; i++) {
    const letter = ` ${guess[i].toUpperCase()} `;
    result[i] = `${chalk.white.bgBlack(letter)}`;
    for (let j = 0; j < word.length; j++) {
      if (guess[i] === word[j] && guessedWord[i] !== "🟩") {
        if (i === j) {
          guessedWord[i] = "🟩";
          const letter = ` ${guess[i].toUpperCase()} `;
          result[i] = `${chalk.black.bgGreen(letter)}`;
        } else {
          guessedWord[i] = "🟨";
          const letter = ` ${guess[i].toUpperCase()} `;
          result[i] = `${chalk.black.bgYellow(letter)}`;
        }
      }
    }
  }
  return { result, guessedWord };
};

const checkTheGuess = (guess, word) => {
  if (guess.length !== 5) {
    return;
  }
  return checkIfLetterExists(guess, word);
};

const selectAWord = () => {
  const index = Math.floor(Math.random() * 123) % dictionary.length;
  return dictionary[index];
};

const askQuesionReturnAnswer = async (blurb = "") => {
  const guess = await prompt(`Make your guess. ${blurb}\n`);
  return guess;
};

const main = async () => {
  const word = selectAWord();
  let maxAttempt = 5;
  for (let i = 0; i <= maxAttempt; i++) {
    let guess = await askQuesionReturnAnswer();
    guess = guess.toLowerCase();
    if (guess.length !== 5) {
      maxAttempt += 1;
      console.log(warning("5-letter word is required"));
      continue;
    }
    if (!dictionary.includes(guess)) {
      maxAttempt += 1;
      console.log(warning("Illegal word"));
      continue;
    }
    const { result, guessedWord } = checkTheGuess(guess, word);
    const set = new Set(guessedWord);
    if (set.size === 1) {
      if (set.has("🟩")) {
        console.log("you win");
        process.exit(0);
      } else if (set.has("🟨")) {
        console.log("nice");
      } else if (set.has("⬛️")) {
        console.log("no luck");
      }
    }
    if (i === maxAttempt) {
      console.log("you lose");
      console.log(`THE WORD was ${word}`);
      process.exit(0);
    }
    const str = result.join("");
    console.log(str);
  }
};

main();
