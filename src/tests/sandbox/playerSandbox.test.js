const player = {
  board: {
    shipHit: false,
  },
};

let hitShip = true;
let confirmDirection = '';
let failedDirections = [];
let smartAttacks = [[1, 1]];
let testedOpposite = false;
let testDone = false;
let prevMoves = [];

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
    if (inPrevious(nextMove) | nextMove.includes(10) | nextMove.includes(-1)) {
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

describe('testing missing all directions', () => {
  let answer = smartAttack();
  test('ai hits ship then smart attacks right', () => {
    expect(answer).toEqual([2, 1]);
  });

  test('ai hits ship then misses and goes down for 2nd smart attack', () => {
    let answer = smartAttack();
    expect(answer).toEqual([1, 2]);
  });

  test('ai hits ship then misses 2x and goes left for 3rd smart attack', () => {
    let answer = smartAttack();
    expect(answer).toEqual([0, 1]);
  });
  test('ai hits ship then misses 3x and goes up for 4th smart attack', () => {
    let answer = smartAttack();
    expect(answer).toEqual([1, 0]);
  });
});

describe('test successful direction', () => {
  beforeAll(() => {
    player.board.shipHit = true;

    hitShip = true;
    confirmDirection = '';
    failedDirections = ['right'];
    smartAttacks = [
      [1, 1],
      [2, 1],
    ];
  });

  test('successful direction - ai hits ship, smart attacks right + hits ship', () => {
    const answer = smartAttack();
    expect(answer).toEqual([3, 1]);
  });

  test('continues right', () => {
    const answer = smartAttack();
    expect(answer).toEqual([4, 1]);
  });
});

describe('hit ship last turn but a 1st direction test will be off edge', () => {
  beforeAll(() => {
    player.board.shipHit = true;

    hitShip = true;
    confirmDirection = '';
    failedDirections = [];
    smartAttacks = [[9, 9]];
  });

  test('first test would be left', () => {
    const answer = smartAttack();
    expect(answer).toEqual([8, 9]);
  });
});

describe('direction test left would be off edge', () => {
  beforeAll(() => {
    player.board.shipHit = false;

    hitShip = true;
    confirmDirection = '';
    failedDirections = ['right', 'down'];
    smartAttacks = [
      [1, 0],
      [2, 0],
    ];
  });

  test('3rd test would be left', () => {
    const answer = smartAttack();
    expect(answer).toEqual([0, 0]);
  });
});

describe('confirmed right but next hit would be off board', () => {
  beforeAll(() => {
    player.board.shipHit = true;
    prevMoves = [
      [8, 0],
      [9, 0],
    ];
    hitShip = true;
    testedOpposite = false;
    testDone = false;
    confirmDirection = 'right';
    failedDirections = ['right'];
    smartAttacks = [
      [8, 0],
      [9, 0],
    ];
  });

  test('next attack would be left', () => {
    const answer = smartAttack();
    expect(answer).toEqual([7, 0]);
  });
});

describe('confirmed right but last attack missed', () => {
  beforeAll(() => {
    player.board.shipHit = false;

    testedOpposite = false;
    hitShip = true;
    confirmDirection = 'right';
    failedDirections = ['right'];
    smartAttacks = [
      [5, 0],
      [6, 0],
      [7, 0],
    ];
  });

  test('next attack would be left', () => {
    const answer = smartAttack();

    expect(answer).toEqual([4, 0]);
  });
});

// const inPrevious = ([x, y]) => {
//   for (let i = 0; i < prevMoves.length; i++) {
//     let [a, b] = prevMoves[i];
//     if (a == x && b == y) {
//       return true;
//     }
//   }
//   return false;
// };

test('prevMoves true', () => {
  prevMoves = [
    [0, 0],
    [1, 0],
  ];
  let coord = [0, 0];
  expect(inPrevious(coord)).toBe(true);
});

test('prevMoves true', () => {
  prevMoves = [
    [0, 1],
    [1, 1],
  ];
  let coord = [1, 0];
  expect(inPrevious(coord)).toBe(false);
});

describe('confirmed right but last attack missed', () => {
  beforeAll(() => {
    prevMoves = [
      [5, 5],
      [5, 6],
      [5, 7],
    ];
    player.board.shipHit = false;

    testedOpposite = false;
    hitShip = true;
    confirmDirection = 'down';
    failedDirections = ['right'];
    smartAttacks = [
      [5, 5],
      [5, 6],
      [5, 7],
    ];
    testDone = false;
  });

  test('next attack would be up', () => {
    const answer = smartAttack();
    expect(answer).toEqual([5, 4]);
  });
});

describe('hit once but next tries are invalid', () => {
  beforeAll(() => {
    prevMoves = [
      [8, 8],
      [0, 0],
      [9, 8],
    ];
    player.board.shipHit = true;

    testedOpposite = false;
    hitShip = true;
    confirmDirection = '';
    failedDirections = [];
    smartAttacks = [[9, 8]];
    testDone = false;
  });

  test('next attack would be down', () => {
    const answer = smartAttack();
    expect(answer).toEqual([9, 9]);
  });
  test('next attack would be up', () => {
    const answer = smartAttack();
    expect(answer).toEqual([9, 7]);
  });
});
