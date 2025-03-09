import { writable } from 'svelte/store';

export type Cell = {
	isMine: boolean;
	detonated: boolean;
	revealed: boolean;
	flagged: boolean;
	neighborMines: number;
};

export type GameState = {
	board: Cell[][];
	mines: number;
	revealed: number;
	gameOver: boolean;
	win: boolean;
};

export const gameState = writable<GameState>({
	board: [],
	mines: 0,
	revealed: 0,
	gameOver: false,
	win: false
});