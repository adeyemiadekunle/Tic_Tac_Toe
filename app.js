// Player Factory Function
const Player = (name, symbol) => {
    const getName = () => name;
    const getSymbol = () => symbol;
    return { getName, getSymbol };
};

// Gameboard Module
const Gameboard = (() => {
    const board = ['', '', '', '', '', '', '', '', ''];

    const getBoard = () => [...board];

    const isBoardFull = () => !board.includes('');

    const isWinner = (symbol) => {
        // Check rows, columns, and diagonals for a win
        const winConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6],            // Diagonals
        ];

        return winConditions.some((condition) => {
            const [a, b, c] = condition;
            return board[a] === symbol && board[b] === symbol && board[c] === symbol;
        });
    };

    const makeMove = (index, symbol) => {
        if (board[index] === '') {
            board[index] = symbol;
            return true; // Move successful
        }
        return false; // Move invalid
    };

    const resetBoard = () => {
        for (let i = 0; i < board.length; i++) {
            board[i] = '';
        }
    };

    return { getBoard, isBoardFull, isWinner, makeMove, resetBoard };
})();


// RenderBoardDOm

const renderBoardToDOM = (board) => {
    const boardElement = document.getElementById('board');
    boardElement.innerHTML = '';
    board.forEach((cell, index) => {
        const cellElement = document.createElement('div');
        cellElement.classList.add('cell');
        cellElement.textContent = cell;
        cellElement.addEventListener('click', () => GameController.makeMove(index));
        boardElement.appendChild(cellElement);
    });
};

const DisplayController = (() => {

    const renderBoard = (board) => {
        renderBoardToDOM(board);
    };

    const announceWinner = (player) => {
        setTimeout(() => {
            alert(`${player.getName()} wins!`);
        }, 100); // Add a small delay (e.g., 100 milliseconds)
    };

    const announceDraw = () => {
        alert('It\'s a draw!');
    };

    return { announceWinner, announceDraw, renderBoard };
})();



// Game Controller Module
const GameController = (() => {
    let currentPlayer = null;
    let gameOver = false;
    const player1 = Player('Player 1', 'X');
    const player2 = Player('Player 2', 'O');

    const startGame = () => {
        currentPlayer = player1;
        gameOver = false;
        Gameboard.resetBoard();
        DisplayController.renderBoard(Gameboard.getBoard());
    };

    const makeMove = (index) => {
        if (!gameOver) {
            if (Gameboard.makeMove(index, currentPlayer.getSymbol())) {
                DisplayController.renderBoard(Gameboard.getBoard());

                if (Gameboard.isWinner(currentPlayer.getSymbol())) {
                    DisplayController.announceWinner(currentPlayer);
                    gameOver = true;
                } else if (Gameboard.isBoardFull()) {
                    DisplayController.announceDraw();
                    gameOver = true;
                } else {
                    currentPlayer = (currentPlayer === player1) ? player2 : player1;
                }
            }
        }
    };

    const resetGame = () => {
        Gameboard.resetBoard();
        DisplayController.renderBoard(Gameboard.getBoard());  //Update the UI
        currentPlayer = player1;
        gameOver = false;
    };

    return { startGame, makeMove, resetGame };
})();


const restartButton = document.getElementById('restart-button');
restartButton.addEventListener('click', () => {
    GameController.resetGame(); // Call the reset function when the button is clicked
});

GameController.startGame();
