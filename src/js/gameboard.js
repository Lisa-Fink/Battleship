import createShip from './ship';

const createGameboard = () => {
  const ships = [];
  const missedAttacks = [];

  return {
    getCoordinates(len, location, direction) {
      const coordinates = [];
      for (let i = 0; i < len; i++) {
        let [x, y] = location;
        if (direction == 'vertical') {
          coordinates.push([x, y + i]);
        } else if (direction == 'horizontal') {
          coordinates.push([x + i, y]);
        }
      }
      return coordinates;
    },
    placeShip(len, location, direction) {
      const ship = createShip(len);
      const coordinates = this.getCoordinates(len, location, direction);
      ships.push({ ship, coordinates });
    },
    receiveAttack(coordinates) {
      const hitShip = this.checkShipLocations(coordinates);

      if (hitShip) {
        this.sendHitToShip(hitShip['ship'], coordinates);
        this.shipHit = coordinates;
      } else {
        this.missedAttack(coordinates);
        this.shipHit = false;
      }
    },
    shipHit: false,

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

export default createGameboard;
