let isGameActive = true;

const gameModal = document.createElement("div");
gameModal.className = "game-modal";
gameModal.innerHTML = `
  <div class="game-modal__content">
    <h2 class="game-modal__title"></h2>
    <h3 class="game-modal__subtitle"></h3>
    <p class="game-modal__message">The correct word was: <span class="game-modal__word"></span></p>
    <button class="game-modal__play-again">Play Again</button>
  </div>
`;
document.body.appendChild(gameModal);

const container = document.createElement("div");
container.className = "container";

const gallowsWrapper = document.createElement("div");
gallowsWrapper.className = "gallows-wrapper";
gallowsWrapper.innerHTML = `
  <img class="gallows-wrapper__img" src="./assets/images/stage0.png" alt="hangman-ing" />
  <h1 class="gallows-wrapper__header">HANGMAN GAME</h1>
`;
container.appendChild(gallowsWrapper);

const quizWrapper = document.createElement("div");
quizWrapper.className = "quiz-wrapper";

const wordArea = document.createElement("ul");
wordArea.className = "word-area";
quizWrapper.appendChild(wordArea);

const hintArea = document.createElement("p");
hintArea.className = "hint-area";
hintArea.innerHTML = 'Hint: <span class="hint-area__hint"></span>';
quizWrapper.appendChild(hintArea);

const incorrectCounter = document.createElement("p");
incorrectCounter.className = "incorrect-counter";
incorrectCounter.innerHTML =
  'Incorrect counts: <span class="incorrect-counter__count">0 / 6</span>';
quizWrapper.appendChild(incorrectCounter);

const keyboard = document.createElement("div");
keyboard.className = "keyboard";
quizWrapper.appendChild(keyboard);

container.appendChild(quizWrapper);
document.body.appendChild(container);

const hangmanImg = document.querySelector(".gallows-wrapper__img");
const incorrectCounts = document.querySelector(".incorrect-counter__count");
const playAgainBtn = gameModal.querySelector(".game-modal__play-again");

let currentWord;
let correctLetters;
let wrongLettersCounter;
const maxAttempts = 6;

const resetGame = () => {
  isGameActive = true;
  correctLetters = [];
  wrongLettersCounter = 0;
  hangmanImg.src = `./assets/images/stage${wrongLettersCounter}.png`;
  incorrectCounts.innerText = `${wrongLettersCounter} / ${maxAttempts}`;
  keyboard.querySelectorAll("button").forEach((btn) => {
    btn.disabled = false;
  });
  wordArea.innerHTML = currentWord
    .split("")
    .map(() => `<li class="word-area__letter"></li>`)
    .join("");
  gameModal.classList.remove("game-modal_show");
};

const gameOver = (isVictory) => {
  isGameActive = false;
  let modalText;

  if (isVictory === true) {
    modalText = `You found the word:`;
  } else {
    modalText = `The correct word was:`;
  }
  gameModal.querySelector(".game-modal__title").innerText = `${
    isVictory ? "victory" : "lost"
  }`;
  gameModal.querySelector(".game-modal__subtitle").innerText = `${
    isVictory ? "Congrats" : "Game over"
  }`;
  gameModal.querySelector(
    ".game-modal__message"
  ).innerHTML = `${modalText} <span class="game-modal__word">${currentWord}</span>`;
  gameModal.classList.add("game-modal_show");
};

const getRandomWord = () => {
  const { word, hint } =
    questionList[Math.floor(Math.random() * questionList.length)];
  currentWord = word;
  document.querySelector(".hint-area__hint").innerText = hint;
  resetGame();
};

const startGame = (button, clickedLetter) => {
  if (currentWord.includes(clickedLetter)) {
    [...currentWord].forEach((letter, index) => {
      if (letter === clickedLetter) {
        correctLetters.push(letter);
        wordArea.querySelectorAll("li")[index].innerText = letter;
        wordArea
          .querySelectorAll("li")
          [index].classList.add("word-area__letter-correct");
      }
    });
  } else {
    wrongLettersCounter++;
    hangmanImg.src = `./assets/images/stage${wrongLettersCounter}.png`;
  }
  button.disabled = true;
  incorrectCounts.innerText = `${wrongLettersCounter} / ${maxAttempts}`;

  if (wrongLettersCounter === maxAttempts) {
    return gameOver(false);
  }

  if (correctLetters.length === currentWord.length) {
    return gameOver(true);
  }
};

for (let i = 97; i < 123; i++) {
  const letter = String.fromCharCode(i);
  const keyboardLetter = document.createElement("button");
  keyboardLetter.innerText = letter;
  keyboardLetter.setAttribute("key", letter);
  keyboardLetter.classList.add("keyboard__button");
  keyboard.appendChild(keyboardLetter);
  keyboardLetter.addEventListener("click", (e) => {
    startGame(keyboardLetter, letter);
  });
}

getRandomWord();

playAgainBtn.addEventListener("click", getRandomWord);

document.addEventListener("keydown", (e) => {
    if (isGameActive && e.key.length === 1 && e.key.match(/[a-z]/i)) {
      const button = keyboard.querySelector(
        `button[key='${e.key.toLowerCase()}']`
      );
      if (button && !button.disabled) {
        startGame(button, e.key.toLowerCase());
      }
    }
  });