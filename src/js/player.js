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
    getNewShipInfo(len) {
      let validLocation = [];
      let coordinate;
      let maxX = 10;
      let maxY = 10;
      const direction =
        Math.floor(Math.random() * 2) == 0 ? 'vertical' : 'horizontal';

      direction == 'vertical' ? (maxY -= len - 1) : (maxX -= len - 1);

      do {
        let x = Math.floor(Math.random() * maxX);
        let y = Math.floor(Math.random() * maxY);
        coordinate = [x, y];

        let coordinates = this.board.getCoordinates(len, coordinate, direction);
        validLocation = coordinates.filter((coord) => {
          return !this.board.checkShipLocations(coord) == false;
        });
      } while (validLocation.length);

      return [len, coordinate, direction];
    },
    randomShips() {
      this.board.placeShip(...this.getNewShipInfo(5));
      this.board.placeShip(...this.getNewShipInfo(4));
      this.board.placeShip(...this.getNewShipInfo(3));
      this.board.placeShip(...this.getNewShipInfo(3));
      this.board.placeShip(...this.getNewShipInfo(2));
    },
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
    getNewShipInfo(len) {
      let validLocation = [];
      let coordinate;
      let maxX = 10;
      let maxY = 10;
      const direction =
        Math.floor(Math.random() * 2) == 0 ? 'vertical' : 'horizontal';

      direction == 'vertical' ? (maxY -= len - 1) : (maxX -= len - 1);

      do {
        let x = Math.floor(Math.random() * maxX);
        let y = Math.floor(Math.random() * maxY);
        coordinate = [x, y];

        let coordinates = this.board.getCoordinates(len, coordinate, direction);
        validLocation = coordinates.filter((coord) => {
          return !this.board.checkShipLocations(coord) == false;
        });
      } while (validLocation.length);

      return [len, coordinate, direction];
    },
    placeShips() {
      this.board.placeShip(...this.getNewShipInfo(5));
      this.board.placeShip(...this.getNewShipInfo(4));
      this.board.placeShip(...this.getNewShipInfo(3));
      this.board.placeShip(...this.getNewShipInfo(3));
      this.board.placeShip(...this.getNewShipInfo(2));
    },
  };
};

export { createPlayer, createAi };
