const socket = io("http://localhost:3000");
console.log("Client started...");

const X_CLASS = "x";
const CIRCLE_CLASS = "circle";
const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];
const winningMessageElement = document.getElementById("winningMessage");
const winningMessageTextElement = document.querySelector(
  "[data-winning-message-text]"
);
const cellElements = document.querySelectorAll("[data-cell]");
const board = document.getElementById("board");
let circleTurn;
let currentClass = X_CLASS;
let ableToPlay = true;

startGame();
restartButton.addEventListener("click", startGame);

function startGame() {
  circleTurn = false;
  cellElements.forEach((cell) => {
    cell.classList.remove(X_CLASS);
    cell.classList.remove(CIRCLE_CLASS);
    cell.removeEventListener("click", handleClick);
    cell.addEventListener("click", handleClick);
  });
  setBoardHoverClass();
}

socket.on("selected-cell", (data) => {
  ableToPlay = true;
  element = document.body.querySelector(
    '.cell[data-no="' + data.cellNumber + '"]'
  );
  element.classList.add(data.player);
  if (data.player === X_CLASS) {
    currentClass = CIRCLE_CLASS;
  } else {
    currentClass = X_CLASS;
  }
  swapTurns();
  setBoardHoverClass();
});

socket.on("end-game-victory", () => {
  winningMessageTextElement.innerText = `You lost! :(`;
  showMessage();
});

socket.on("end-game-draw", () => {
  winningMessageTextElement.innerText = `It's a draw! :/`;
  showMessage();
});

function handleClick(e) {
  if (ableToPlay) {
    const cell = e.target;
    const cellNo = e.target.getAttribute("data-no");
    socket.emit("selected-cell", { cellNumber: cellNo, player: currentClass });
    placeMark(cell, currentClass);
    ableToPlay = false;
    if (checkWin(currentClass)) {
      endGame(false);
    } else if (isDraw()) {
      endGame(true);
    } else {
      swapTurns();
      setBoardHoverClass();
    }
  }
}

function endGame(draw) {
  if (draw) {
    socket.emit("end-game-draw", "draw");
    winningMessageTextElement.innerText = `It's a draw! :/`;
    showMessage();
  } else {
    socket.emit("end-game-victory", "victory");
    winningMessageTextElement.innerText = `You won! :)`;
    showMessage();
  }
}

function showMessage() {
  winningMessageElement.classList.add("show");
}

function isDraw() {
  return [...cellElements].every((cell) => {
    return (
      cell.classList.contains(X_CLASS) || cell.classList.contains(CIRCLE_CLASS)
    );
  });
}

function placeMark(cell, currentClass) {
  cell.classList.add(currentClass);
}

function swapTurns() {
  circleTurn = !circleTurn;
}

function setBoardHoverClass() {
  board.classList.remove(X_CLASS);
  board.classList.remove(CIRCLE_CLASS);
  if (circleTurn) {
    board.classList.add(CIRCLE_CLASS);
  } else {
    board.classList.add(X_CLASS);
  }
}

function checkWin(currentClass) {
  return WINNING_COMBINATIONS.some((combination) => {
    return combination.every((index) => {
      return cellElements[index].classList.contains(currentClass);
    });
  });
}
