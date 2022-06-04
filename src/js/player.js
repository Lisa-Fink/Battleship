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
  let hitShip = false;
  let confirmDirection = '';
  let failedDirections = [];
  let smartAttacks = [];
  let testedOpposite = false;
  let testDone = false;
  const getAttackCoordinates = () => {
    if (!testDone) {
      // first successful hit
      if (player.board.shipHit != false && hitShip != true) {
        hitShip = true;
        smartAttacks.push(player.board.shipHit);
        return smartAttack();
      }
      if (hitShip) {
        //if last turn was a successful direction test, confirm direction
        if (player.board.shipHit != false && !confirmDirection) {
          confirmDirection = failedDirections[failedDirections.length - 1];
        }
        return smartAttack();
      }
    }

    // assume the ship is sunk if confirmed a direction, and opposite missed
    if (
      (confirmDirection && player.board.shipHit == false && testedOpposite) |
      testDone
    ) {
      // clear previous sunk ship data
      hitShip = false;
      confirmDirection = '';
      failedDirections = [];
      smartAttacks = [];
      testedOpposite = false;
      testDone = false;
    }

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
  const inPrevious = ([x, y]) => {
    for (let i = 0; i < prevMoves.length; i++) {
      let [a, b] = prevMoves[i];
      if (a == x && b == y) {
        return true;
      }
    }
    return false;
  };
  const smartAttack = () => {
    const firstMove = smartAttacks[0];
    let [x, y] =
      failedDirections.length && player.board.shipHit != false
        ? smartAttacks[smartAttacks.length - 1]
        : firstMove;
    let moves = {
      right: [x + 1, y],
      down: [x, y + 1],
      left: [x - 1, y],
      up: [x, y - 1],
    };
    let nextMove;

    // tried a direction and had successful hit,
    if (
      failedDirections.length &&
      player.board.shipHit != false &&
      !confirmDirection
    ) {
      // set confirm direction if this is the 1st successful hit
      confirmDirection = failedDirections[failedDirections.length - 1];
    }
    if (confirmDirection) {
      if (
        moves[confirmDirection].includes(10) |
        moves[confirmDirection].includes(-1) |
        (player.board.shipHit == false) |
        inPrevious(moves[confirmDirection])
      ) {
        if (!testedOpposite) {
          // reverse direction
          confirmDirection == 'right'
            ? (confirmDirection = 'left')
            : confirmDirection == 'down'
            ? (confirmDirection = 'up')
            : confirmDirection == 'left'
            ? (confirmDirection = 'right')
            : (confirmDirection = 'down');
          // reset moves to go new direction from first move
          let [x, y] = firstMove;
          let moves = {
            right: [x + 1, y],
            down: [x, y + 1],
            left: [x - 1, y],
            up: [x, y - 1],
          };
          testedOpposite = true;
          nextMove = moves[confirmDirection];
        } else {
          testDone = true;
          return getAttackCoordinates();
        }
      } else {
        nextMove = moves[confirmDirection];
      }
      // if the next move is invalid
      if (
        inPrevious(nextMove) |
        nextMove.includes(10) |
        nextMove.includes(-1)
      ) {
        testDone = true;
        return getAttackCoordinates();
      }
      smartAttacks.push(nextMove);
      return nextMove;
    }

    //1st test going right -
    if (
      !failedDirections.includes('right') &&
      !moves.right.includes(10) &&
      !inPrevious(moves.right)
    ) {
      nextMove = moves.right;
      failedDirections.push('right');
      smartAttacks.push(nextMove);
      return nextMove;
    }
    //2nd test going down
    else if (
      !failedDirections.includes('down') &&
      !moves.down.includes(10) &&
      !inPrevious(moves.down)
    ) {
      nextMove = moves.down;
      failedDirections.push('down');
    }
    //3rd test going  left
    else if (
      !failedDirections.includes('left') &&
      !moves.left.includes(-1) &&
      !inPrevious(moves.left)
    ) {
      nextMove = moves.left;
      failedDirections.push('left');
      testedOpposite = true;
    }
    //4th test going up
    else if (
      !failedDirections.includes('up') &&
      !moves.up.includes(-1) &&
      !inPrevious(moves.up)
    ) {
      nextMove = moves.up;
      failedDirections.push('up');
      testedOpposite = true;
    }
    // replace the unsuccessful coord with new test coord
    smartAttacks.length > 1
      ? (smartAttacks[smartAttacks.length - 1] = nextMove)
      : smartAttacks.push(nextMove);
    return nextMove;
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
