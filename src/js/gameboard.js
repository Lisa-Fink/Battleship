import createShip from './ship';

const createGameboard = () => {
  // const board = createBoard();
  const ships = [];
  const missedAttacks = [];

  const getCoordinates = (len, location, direction) => {
    const coordinates = [];
    for (let i = 0; i < len; i++) {
      let [x, y] = location;
      if (direction == 'horizontal') {
        coordinates.push([x, y + i]);
      } else if (direction == 'vertical') {
        coordinates.push([x + i, y]);
      }
    }
    return coordinates;
  };
  return {
    placeShip(len, location, direction) {
      const ship = createShip(len);
      const coordinates = getCoordinates(len, location, direction);
      ships.push({ ship, coordinates });
    },
    receiveAttack(coordinates) {
      const hitShip = this.checkShipLocations(coordinates);

      if (hitShip) {
        this.sendHitToShip(hitShip['ship'], coordinates);
      } else {
        this.missedAttack(coordinates);
      }
    },

    missedAttack(coordinates) {
      missedAttacks.push(coordinates);
    },

    getMissedAttacks() {
      return missedAttacks;
    },

    sendHitToShip(ship, coordinates) {
      ship.hit(coordinates);
    },

    getShips() {
      return ships;
    },
    getBoard() {
      return board;
    },

    checkShipLocations(attackLoc) {
      for (let shipInfo of ships) {
        const match = shipInfo['coordinates'].filter((a) => {
          let [x, y] = a;
          let [i, j] = attackLoc;
          return x == i && y == j;
        });
        if (match.length) {
          return { ship: shipInfo['ship'], attackLoc: attackLoc };
        }
      }
      return false;
    },
    checkAllShipsSunk() {
      return ships.every((arrShip) => arrShip.ship.isSunk() == true);
    },
  };
};

// const createBoard = () => {
//   const board = [];
//   for (let i = 0; i < 10; i++) {
//     let row = [];
//     for (let j = 0; j < 10; j++) {
//       row.push('0');
//     }
//     board.push(row);
//   }
//   return board;
// };

export default createGameboard;
