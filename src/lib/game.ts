import { type Cell } from './stores';

type Board = Cell[][];

export function createBoard(width: number, height: number, mines: number): Board {
	// Create empty board with no mines
	let board: Board = Array(height).fill(0).map(() =>
		Array(width).fill(0).map(() => ({
			isMine: false,
			detonated: false,
			revealed: false,
			flagged: false,
			neighborMines: 0
		}))
	);

	return board;
}

export function placeMines(board: Board, mines: number, safeX: number, safeY: number): void {
	const width = board[0].length;
	const height = board.length;
	
	// Generate a list of safe cells around the first click
	const safeCells = new Set<string>();
	for (let dy = -1; dy <= 1; dy++) {
		for (let dx = -1; dx <= 1; dx++) {
			const y = safeY + dy;
			const x = safeX + dx;
			if (y >= 0 && y < height && x >= 0 && x < width) {
				safeCells.add(`${x},${y}`);
			}
		}
	}
	
	// Place mines (avoiding the safe area)
	let minesPlaced: number = 0;
	while (minesPlaced < mines) {
		const x: number = Math.floor(Math.random() * width);
		const y: number = Math.floor(Math.random() * height);
		const cellKey = `${x},${y}`;
		
		if (!board[y][x].isMine && !safeCells.has(cellKey)) {
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
