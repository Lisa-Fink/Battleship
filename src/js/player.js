import createGameboard from './gameboard';

const createPlayer = (name = 'Larry') => {
  const playerName = name;
  let ai;

  return {
    board: createGameboard(),
    setOpponent(opp) {
      ai = opp;
    },
    attack(coordinates) {
      ai.board.receiveAttack(coordinates);
    },
  };
};

const createAi = () => {
  let player;
  const prevMoves = [];
  return {
    setPlayer(pl) {
      player = pl;
    },
    board: createGameboard(),
    attack() {
      player.board.receiveAttack(getAttackCoordinates());
    },
  };
};

export { createPlayer, createAi };
