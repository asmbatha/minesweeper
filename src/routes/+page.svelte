<script lang="ts">
  import { gameState } from '$lib/stores';
  import type { Cell, GameState } from '$lib/stores';
  import { createBoard, revealCell } from '$lib/game';

  const DIFFICULTY = {
    BEGINNER: { width: 9, height: 9, mines: 10 },
    INTERMEDIATE: { width: 16, height: 16, mines: 40 },
    EXPERT: { width: 30, height: 16, mines: 99 }
  };

  let difficulty = DIFFICULTY.BEGINNER;

  function initGame() {
    const board: Cell[][] = createBoard(difficulty.width, difficulty.height, difficulty.mines);
    gameState.set({
      board,
      mines: difficulty.mines,
      revealed: 0,
      gameOver: false,
      win: false
    } as GameState);
  }

  function handleCellClick(x: number, y: number) {
    gameState.update(state => {
      if (state.gameOver) return state;

      if (state.board[y][x].isMine) {
        state.board[y][x].detonated = true
        state.gameOver = true;
        return state;
      }

      revealCell(state.board, x, y);

      // Check win condition
      let revealed = 0;
      state.board.forEach((row: Cell[]) => {
        row.forEach((cell: Cell) => {
          if (cell.revealed) revealed++;
        });
      });

      state.revealed = revealed;
      if (revealed === difficulty.width * difficulty.height - difficulty.mines) {
        state.win = true;
        state.gameOver = true;
      }

      return state;
    });
  }

  function handleContextMenu(event: MouseEvent, x: number, y: number) {
    event.preventDefault();
    gameState.update(state => {
      if (!state.gameOver && !state.board[y][x].revealed) {
        state.board[y][x].flagged = !state.board[y][x].flagged;
      }
      return state;
    });
  }

  $: {
    initGame();
  }
</script>

<main class="container">
  <div class="controls">
    <select
      bind:value={difficulty}
      on:change={initGame}
    >
      {#each Object.entries(DIFFICULTY) as [name, config]}
        <option value={config}>{name}</option>
      {/each}
    </select>
    <button on:click={initGame}>New Game</button>
    {#if $gameState.gameOver}
      <span class="status">{$gameState.win ? 'You Win!' : 'Game Over!'}</span>
    {/if}
  </div>

  <div class="board"
       style="grid-template-columns: repeat({difficulty.width}, 30px);">
    {#each $gameState.board as row, y}
      {#each row as cell, x}
        <button
          class="cell"
          class:revealed={cell.revealed}
          class:mine={cell.isMine && $gameState.gameOver}
          class:flagged={cell.flagged}
          class:detonated={cell.detonated}
          disabled={$gameState.gameOver || cell.flagged}
          on:click={() => handleCellClick(x, y)}
          on:contextmenu={(e) => handleContextMenu(e, x, y)}
        >
          {#if cell.revealed && !cell.isMine}
            {cell.neighborMines || ''}
          {/if}
        </button>
      {/each}
    {/each}
  </div>
</main>

<style>
  .container {
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }

  .controls {
    display: flex;
    gap: 10px;
    align-items: center;
  }

  .board {
    display: grid;
    gap: 1px;
    background: #ddd;
    padding: 1px;
  }

  .cell {
    width: 30px;
    height: 30px;
    background: #ccc;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    user-select: none;
    cursor: pointer;
    border-color: #ccc;
  }

  .cell:hover {
    background: #ddd;
  }

  .cell.revealed {
    background: #f5f5f5;
    border: none;
    font-size: .9em;
  }

  .cell.detonated {
    background: #f88;
  }

  .cell.mine::before {
    content: "💣";
  }

  .cell.flagged::before {
    content: "🚩";
  }

  .cell:disabled {
    color: rgb(16, 16, 16)
  }

  .status {
    font-weight: bold;
    font-size: 1.2em;
  }
</style>
