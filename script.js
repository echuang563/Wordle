//word bank
const wordBank = [
  "lemon","apple", "mango", "grape", "melon", "peach", "olive", "prune", "onion",
   "pasta", "bacon", "bread", "pizza", "chips", "nacho", "donut", "cakes", "steak",
   "beans", "berry", "candy", "chili", "crepe", "curry", "gravy", "jelly", "kebab",
   "bagel", "salad", "salsa"
]


//class for the game of wordle
class Game {
  constructor() {
    //random answer from our word bank
    this.answer = wordBank[Math.floor(Math.random() * wordBank.length)];
    //display answer for each game for debugging
    console.log("Answer: " + this.answer);
    //we can keep track of the current row, max guesses, game status
    this.currentRow = 0;
    this.maxGuess = 6;
    this.gameFinished = false;
    this.used = {};

    //sets up board visually
    this.createBoard();
  }

//function to build board 
//6 rows of 5 cells each
  createBoard() {
    const board = document.getElementById("gameBoard");
    board.innerHTML = "";
    //iterate to create rows 
    for (let i = 0; i < this.maxGuess; i++) {
      const row = document.createElement("div");
      row.classList.add("wordRow");
      for (let j = 0; j < 5; j++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        row.appendChild(cell);
      }
      board.appendChild(row);
    }
    //to show used leter board
    this.updateUsedLetters();
  }


//function to updateUsedLetters
  updateUsedLetters() {
    const usedLetters = document.getElementById("usedLetters");
    usedLetters.innerHTML = "";
    "abcdefghijklmnopqrstuvwxyz".split("").forEach(letter => {
          const box = document.createElement("div");
          box.classList.add("letterBox");
          if (this.used[letter] === "correct") box.classList.add("correct");
          else if (this.used[letter] === "wrong-place") box.classList.add("wrong-place");
          else if (this.used[letter] === "wrong") box.classList.add("wrong");
          box.textContent = letter;
          usedLetters.appendChild(box);
        });
      }

//function for guessing word
  guessWord(word) {
    //edge case if game fininshed already
    if (this.gameFinished) return;
    //account for capitalization
    word = word.toLowerCase();
    if (word.length !== 5) {
      alert("Please enter a valid 5-letter word" );
      return;
    }
    const row = document.querySelectorAll(".wordRow")[this.currentRow];
    const answerArray = this.answer.split("");
    const guessArray = word.split("");
    const result = Array(5).fill("wrong");

    //correct positions
    guessArray.forEach((letter, i) => {
      if (letter === answerArray[i]) {
        result[i] = "correct";
        answerArray[i] = null;
      }
    });

    //wrong positions
    guessArray.forEach((letter, i) => {
      if (result[i] !== "correct" && answerArray.includes(letter)) {
        result[i] = "wrong-place";
        answerArray[answerArray.indexOf(letter)] = null;
      }
    });

    //display
    result.forEach((res, i)=> {
      const cell = row.children[i];
      cell.textContent = guessArray[i];
      cell.classList.add(res);
      const letter = guessArray[i];
      if (this.used[letter] !== "correct") {
        this.used[letter] = res;
      }
    });

    this.updateUsedLetters();

    if(result.every(r => r === "correct")) {
      alert("Congrats! You got it!");
      this.endGame();
    } else if (++this.currentRow >= this.maxGuess) {
      alert("Not hungry enough! The word was: " + this.answer.toUpperCase());
      this.endGame();
    }
  } 
  
  //call when game ends win or lose
  endGame() {
    this.gameFinished = true;
    document.getElementById("restartButton").style.display = "block";
  }

  //restart game state
  restart() {
    this.answer = wordBank[Math.floor(Math.random() *wordBank.length)];
    console.log("Answer: ", this.answer);
    this.currentRow = 0;
    this.gameFinished = false;
    this.used = {};
    this.createBoard();
    document.getElementById("restartButton").style.display = "none";
    document.getElementById("guessInput").value = "";
  }
}

//new game state
const game = new Game();

//use api to check if the submitted word is a real word using api 
const isValid = async (word) => {
  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    return response.ok;
  } catch (err) {
    console.error("API Error: ", err);
    return false;
  }
}

//submit button listener
document.getElementById("submitButton").addEventListener("click", async () => {
  const guess = document.getElementById("guessInput").value.toLowerCase();

  if (guess.length !== 5) {
    alert("Please enter a 5-letter word.");
    return;
  }

  const valid = await isValid(guess);
  if (!valid) {
    alert("That isn't a real word!");
    return;
  }

  game.guessWord(guess);
  document.getElementById("guessInput").value = "";
});

//need restart button listener as well.
document.getElementById("restartButton").addEventListener("click", () => {
  game.restart();
})
