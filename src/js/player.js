import createGameboard from './gameboard';
import { gameLoop } from './game';
const createPlayer = () => {
  let ai;
  const type = 'player';
  const getType = () => {
    return type;
  };

  return {
    board: createGameboard(),
    setOpponent(obj) {
      ai = obj;
    },
    attack(coordinates) {
      ai.board.receiveAttack(coordinates);
      gameLoop();
    },
    getType,
  };
};

const createAi = () => {
  const type = 'ai';
  let player;
  const prevMoves = [];
  const getAttackCoordinates = () => {
    const possibleMoves = [];
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        const checkValid = prevMoves.filter((move) => {
          let [x, y] = move;
          return x == i && y == j;
        });
        !checkValid.length ? possibleMoves.push([i, j]) : null;
      }
    }
    const NumChoices = possibleMoves.length;
    const choice = Math.floor(Math.random() * NumChoices);
    return possibleMoves[choice];
  };
  const getType = () => {
    return type;
  };
  return {
    turn: false,
    setPlayer(obj) {
      player = obj;
    },
    getPlayer() {
      return player;
    },
    board: createGameboard(),
    attack() {
      const attackCoordinates = getAttackCoordinates();
      player.board.receiveAttack(attackCoordinates);
      prevMoves.push(attackCoordinates);
    },
    getType,
  };
};

export { createPlayer, createAi };
