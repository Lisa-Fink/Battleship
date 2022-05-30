import createGameboard from './gameboard';

const createPlayer = (name = 'Larry') => {
  const playerName = name;
  let ai;

  return {
    board: createGameboard(),
    setOpponent(obj) {
      ai = obj;
    },
    attack(coordinates) {
      ai.board.receiveAttack(coordinates);
      ai.turn = true;
    },
  };
};

const createAi = () => {
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
  return {
    setPlayer(obj) {
      player = obj;
    },
    board: createGameboard(),
    attack() {
      const attackCoordinates = getAttackCoordinates();
      player.board.receiveAttack(attackCoordinates);
      prevMoves.push(attackCoordinates);
      this.turn = false;
    },
  };
};

export { createPlayer, createAi };
