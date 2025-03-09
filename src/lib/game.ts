import { type Cell } from './stores';

type Board = Cell[][];

export function createBoard(width: number, height: number, mines: number): Board {
	let board: Board = Array(height).fill(0).map(() =>
		Array(width).fill(0).map(() => ({
			isMine: false,
			detonated: false,
			revealed: false,
			flagged: false,
			neighborMines: 0
		}))
	);

	// Place mines
	let minesPlaced: number = 0;
	while (minesPlaced < mines) {
		const x: number = Math.floor(Math.random() * width);
		const y: number = Math.floor(Math.random() * height);
		if (!board[y][x].isMine) {
			board[y][x].isMine = true;
			minesPlaced++;
		}
	}

	// Calculate neighbor mines
	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			if (!board[y][x].isMine) {
				let count: number = 0;
				for (let dy = -1; dy <= 1; dy++) {
					for (let dx = -1; dx <= 1; dx++) {
						if (y + dy >= 0 && y + dy < height && x + dx >= 0 && x + dx < width) {
							if (board[y + dy][x + dx].isMine) count++;
						}
					}
				}
				board[y][x].neighborMines = count;
			}
		}
	}

	return board;
}

export function revealCell(board: Board, x: number, y: number) {
	if (x < 0 || x >= board[0].length || y < 0 || y >= board.length) return;
	if (board[y][x].revealed || board[y][x].flagged) return;

	board[y][x].revealed = true;

	if (board[y][x].neighborMines === 0) {
		for (let dy = -1; dy <= 1; dy++) {
			for (let dx = -1; dx <= 1; dx++) {
				revealCell(board, x + dx, y + dy);
			}
		}
	}
}
