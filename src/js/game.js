import { createPlayer, createAi } from './player';
import {
  drawBoards,
  drawShips,
  updateBoard,
  gameOver,
  getSettings,
} from './display';
import '../style.css';

let player;
let ai;

const startGame = () => {
  player = createPlayer();
  ai = createAi();
  player.setOpponent(ai);

  ai.setPlayer(player);

  drawBoards(ai);

  ai.placeShips();
  setTimeout(getSettings, 100, player);
};
startGame();

const gameLoop = () => {
  ai.turn = true;
  updateBoard(ai);
  let gameIsOverPlayer = ai.board.checkAllShipsSunk();
  if (!gameIsOverPlayer) {
    ai.attack();
    updateBoard(player);
    var gameIsOverAi = player.board.checkAllShipsSunk();
  }
  if (gameIsOverPlayer | gameIsOverAi) {
    gameIsOverPlayer ? gameOver('player') : gameOver('ai');
  } else {
    ai.turn = false;
  }
};

export { startGame, gameLoop };
