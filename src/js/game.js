import { createPlayer, createAi } from './player';
import { drawBoards, drawShips, updateBoard, gameOver } from './display';
import '../style.css';

let player;
let ai;

const startGame = () => {
  player = createPlayer();
  ai = createAi();
  player.setOpponent(ai);
  ai.setPlayer(player);
  drawBoards(ai);
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

// temporary populating player and ai gameboard with ships
// this is where place ships would be
player.board.placeShip(4, [1, 1], 'horizontal');
player.board.placeShip(3, [2, 3], 'vertical');
player.board.placeShip(2, [8, 8], 'horizontal');
player.board.placeShip(5, [6, 2], 'vertical');

// ai.board.placeShip(4, [3, 1], 'horizontal');
// ai.board.placeShip(3, [5, 7], 'vertical');
ai.board.placeShip(1, [0, 0], 'vertical');
//

drawShips(player);

// //temporary adding hits to ships
// //ai attacking
// const ships = player.board.getShips();
// ships[0].ship.hit(ships[0].coordinates[0]);
// updateBoard(player);

// // player attacking a ship
// const aiShips = ai.board.getShips();
// aiShips[0].ship.hit(ships[0].coordinates[0]);
// updateBoard(ai);
// //

// //temporary adding miss - tbchanged to if ai.turn -->ai.attack
// // ai auto attack
// ai.attack();
// updateBoard(player);
// player.attack([9, 9]);
// updateBoard(ai);
// ai.turn = false;

// game loop

export { startGame, gameLoop };
