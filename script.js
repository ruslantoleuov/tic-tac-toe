"use strict";

const gameBoard = (function () {
  "use strict";

  const PLAYER = "x";
  const OPONENT = "o";
  const MAXINITIALVALUE = -Infinity;
  const MININITIALVALUE = +Infinity;
  const MAXSCORE = +10;
  const MINSCORE = -10;
  const board = [[], [], []];
  let isAIPlayedFirstMove = false;
  let roundEnd = false;

  function isMovesLeft(board) {
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board.length; j++) {
        if (board[i][j] === undefined) {
          return true;
        }
      }
    }

    return false;
  }

  function evaluate(board) {
    for (let i = 0; i < board.length; i++) {
      if (board[i][0] === board[i][1] && board[i][1] === board[i][2]) {
        switch (board[i][0]) {
          case PLAYER:
            return MAXSCORE;
          case OPONENT:
            return MINSCORE;
          default:
            break;
        }
      }

      if (board[0][i] === board[1][i] && board[1][i] === board[2][i]) {
        switch (board[0][i]) {
          case PLAYER:
            return MAXSCORE;
          case OPONENT:
            return MINSCORE;
          default:
            break;
        }
      }
    }

    if (board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
      switch (board[0][0]) {
        case PLAYER:
          return MAXSCORE;
        case OPONENT:
          return MINSCORE;
        default:
          break;
      }
    }

    if (board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
      switch (board[0][2]) {
        case PLAYER:
          return MAXSCORE;
        case OPONENT:
          return MINSCORE;
        default:
          break;
      }
    }

    return 0;
  }

  function minimax(board, depth, isMax, alpha, beta) {
    let score = evaluate(board);

    if (score === MAXSCORE) return score - depth;

    if (score === MINSCORE) return score + depth;

    if (isMovesLeft(board) === false) return 0;

    if (isMax) {
      let best = MAXINITIALVALUE;

      out: for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board.length; j++) {
          if (board[i][j] === undefined) {
            board[i][j] = PLAYER;

            best = Math.max(
              best,
              minimax(board, depth + 1, !isMax, alpha, beta)
            );
            delete board[i][j];
            alpha = Math.max(alpha, best);
            if (beta <= alpha) break out;
          }
        }
      }
      return best;
    } else {
      let best = MININITIALVALUE;

      out: for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board.length; j++) {
          if (board[i][j] === undefined) {
            board[i][j] = OPONENT;

            best = Math.min(
              best,
              minimax(board, depth + 1, !isMax, alpha, beta)
            );
            delete board[i][j];
            beta = Math.min(beta, best);
            if (beta <= alpha) break out;
          }
        }
      }
      return best;
    }
  }

  function findBestMove(board) {
    let bestVal = MININITIALVALUE;
    const bestMove = { row: 0, col: 0 };

    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board.length; j++) {
        if (board[i][j] === undefined) {
          board[i][j] = OPONENT;

          let moveVal = minimax(
            board,
            0,
            true,
            MAXINITIALVALUE,
            MININITIALVALUE
          );

          delete board[i][j];

          if (moveVal < bestVal) {
            bestMove.row = i;
            bestMove.col = j;
            bestVal = moveVal;
          }
        }
      }
    }

    return bestMove;
  }

  function selectCell(row, col) {
    return displayController.boardEl.querySelector(
      `.cell[data-row="${row}"].cell[data-col="${col}"]`
    );
  }

  function firstRandomAIMove(rowEL, colEl) {
    const rowRandom = Math.floor(Math.random() * 3);
    const colRandom = Math.floor(Math.random() * 3);

    if (board[rowRandom][colRandom] !== PLAYER) {
      board[rowRandom][colRandom] = OPONENT;
      selectCell(rowRandom, colRandom).textContent =
        board[rowRandom][colRandom];
      isAIPlayedFirstMove = true;
      return;
    }

    firstRandomAIMove(rowEL, colEl);
  }

  function markTheBoard(e) {
    if (
      e.target !== this &&
      board[e.target.dataset.row][e.target.dataset.col] !== OPONENT &&
      isMovesLeft(board) &&
      !roundEnd
    ) {
      board[e.target.dataset.row][e.target.dataset.col] = PLAYER;
      e.target.textContent = board[e.target.dataset.row][e.target.dataset.col];

      checkWinner();

      if (!isAIPlayedFirstMove) {
        firstRandomAIMove(+e.target.dataset.row, +e.target.dataset.col);
      } else if (isMovesLeft(board) && !roundEnd) {
        const bestMove = findBestMove(board);
        board[bestMove.row][bestMove.col] = OPONENT;
        selectCell(bestMove.row, bestMove.col).textContent =
          board[bestMove.row][bestMove.col];
        checkWinner();
      }
    }
  }

  function checkWinner() {
    for (let i = 0; i < board.length; i++) {
      if (board[i][0] === board[i][1] && board[i][1] === board[i][2]) {
        switch (board[i][0]) {
          case PLAYER:
          case OPONENT:
            for (let j = 0; j < board.length; j++) {
              selectCell(i, j).classList.add("winner");
            }
            roundEnd = true;
            return;
          default:
            break;
        }
      }

      if (board[0][i] === board[1][i] && board[1][i] === board[2][i]) {
        switch (board[0][i]) {
          case PLAYER:
          case OPONENT:
            for (let j = 0; j < board.length; j++) {
              selectCell(j, i).classList.add("winner");
            }
            roundEnd = true;
            return;
          default:
            break;
        }
      }
    }

    if (board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
      switch (board[0][0]) {
        case PLAYER:
        case OPONENT:
          for (let i = 0; i < board.length; i++) {
            selectCell(i, i).classList.add("winner");
          }
          roundEnd = true;
          return;
        default:
          break;
      }
    }

    if (board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
      switch (board[0][2]) {
        case PLAYER:
        case OPONENT:
          let boardLength = board.length - 1;
          for (let i = 0; i < board.length; i++) {
            selectCell(i, boardLength--).classList.add("winner");
          }
          roundEnd = true;
          return;
        default:
          break;
      }
    }
  }

  function resetEverything() {
    for (let i = 0; i < board.length; i++) {
      board[i] = [];
    }

    for (const cell of displayController.boardEl.children) {
      cell.textContent = "";
      cell.classList.remove("winner");
    }

    isAIPlayedFirstMove = false;
    roundEnd = false;
  }

  return {
    markTheBoard,
    resetEverything,
  };
})();

const displayController = (function () {
  "use strict";

  const boardEl = document.querySelector(".board");
  const resetBtn = document.querySelector(".reset-btn");

  boardEl.addEventListener("click", gameBoard.markTheBoard);
  resetBtn.addEventListener("click", gameBoard.resetEverything);

  return {
    boardEl,
  };
})();
