const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const restartBtn = document.getElementById("restart");

const clickSound = new Audio("./click.wav");
const winSound = new Audio("./win.wav");

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;

const WIN_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

// 🎮 Game Start
cells.forEach(cell => cell.addEventListener("click", handleClick));
restartBtn.addEventListener("click", restartGame);

function handleClick(e) {
  const index = e.target.dataset.index;

  if (board[index] !== "" || !gameActive) return;

  makeMove(index, currentPlayer);
  clickSound.play();

  if (!gameActive) return;

  setTimeout(aiMove, 500);
}

function makeMove(index, player) {
  board[index] = player;
  cells[index].textContent = player;
  cells[index].classList.add(player);

  const winner = checkWinner();

  if (winner) {
    showResult(winner);
  } else {
    currentPlayer = player === "X" ? "O" : "X";
    statusText.textContent = currentPlayer === "X" ? "Your turn (X)" : "AI's turn (O)";
  }
}

function checkWinner() {
  for (let combo of WIN_COMBINATIONS) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      highlightWinningCells(combo);
      return board[a];
    }
  }

  if (!board.includes("")) return "tie";
  return null;
}

function highlightWinningCells(combo) {
  combo.forEach(i => {
    cells[i].style.boxShadow = "0 0 25px #fff";
  });
}

function showResult(result) {
  winSound.play();

  if (result === "tie") {
    statusText.textContent = "It's a Tie 😐";
  } else {
    statusText.textContent = `${result} Wins! 🎉`;
  }

  gameActive = false;
}

// 🤖 AI Logic - Minimax Algorithm
function aiMove() {
  const bestMove = findBestMove(board);
  makeMove(bestMove, "O");
  clickSound.play();
}

function findBestMove(newBoard) {
  let bestScore = -Infinity;
  let move;

  for (let i = 0; i < 9; i++) {
    if (newBoard[i] === "") {
      newBoard[i] = "O";
      let score = minimax(newBoard, 0, false);
      newBoard[i] = "";

      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
}

function minimax(boardState, depth, isMaximizing) {
  const result = checkWinnerForMinimax(boardState);
  if (result !== null) {
    if (result === "O") return 10 - depth;
    if (result === "X") return depth - 10;
    return 0;
  }

  if (isMaximizing) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (boardState[i] === "") {
        boardState[i] = "O";
        best = Math.max(best, minimax(boardState, depth + 1, false));
        boardState[i] = "";
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (boardState[i] === "") {
        boardState[i] = "X";
        best = Math.min(best, minimax(boardState, depth + 1, true));
        boardState[i] = "";
      }
    }
    return best;
  }
}

// Helper for AI to simulate game
function checkWinnerForMinimax(b) {
  for (let combo of WIN_COMBINATIONS) {
    const [a, b1, c] = combo;
    if (b[a] && b[a] === b[b1] && b[a] === b[c]) return b[a];
  }
  if (!b.includes("")) return "tie";
  return null;
}

// 🔁 Restart Game
function restartGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  gameActive = true;
  statusText.textContent = "Your turn (X)";
  cells.forEach(cell => {
    cell.textContent = "";
    cell.classList.remove("X", "O");
    cell.style.boxShadow = "";
  });
}
