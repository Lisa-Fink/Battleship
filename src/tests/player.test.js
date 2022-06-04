import { createPlayer, createAi } from '../js/player';
import startGame from '../js/game';

jest.mock('../js/game', () => ({
  startGame: jest.fn(),
  gameLoop: jest.fn(),
}));

test('player attack sends function', () => {
  const player = createPlayer();
  const ai = createAi();

  const mockFunction = jest.fn();
  ai.board.receiveAttack = mockFunction;

  player.setOpponent(ai);
  player.attack([1, 6]);
  expect(mockFunction).toHaveBeenCalled();
});

test('ai attack sends function', () => {
  const ai = createAi();
  const player = createPlayer();
  ai.setPlayer(player);
  ai.attack();

  const mockFunction = jest.fn();
  player.board.receiveAttack = mockFunction;
  ai.attack();
  expect(mockFunction).toHaveBeenCalled();
});

test('getAttackCoordinates functions correctly on smaller mock function', () => {
  const mockPrevMoves = [
    [0, 0],
    [0, 1],
    [1, 0],
  ];
  const mockGetAttackCoordinates = () => {
    const mockPossibleMoves = [];
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 2; j++) {
        const checkValid = mockPrevMoves.filter((move) => {
          let [x, y] = move;
          return x == i && y == j;
        });
        !checkValid.length ? mockPossibleMoves.push([i, j]) : null;
      }
    }
    const NumChoices = mockPossibleMoves.length;
    const choice = Math.floor(Math.random() * NumChoices);
    return mockPossibleMoves[choice];
  };
  expect(mockGetAttackCoordinates()).toEqual([1, 1]);
});

// place 5 ships
// lengths : 5, 4, 3, 3, 2

test('ai places a ship', () => {
  const ai = createAi();

  const mockFunction = jest.fn();

  ai.board.placeShip = mockFunction;

  ai.placeShips();

  expect(mockFunction).toHaveBeenCalled();
});

test('ai place ships creates random location, and direction', () => {
  // random always returns .5 for this test
  jest.spyOn(global.Math, 'random').mockReturnValue(0.9);

  const ai = createAi();

  const mockFunction = jest.fn();
  ai.board.placeShip = mockFunction;
  ai.placeShips();

  expect(mockFunction).toHaveBeenNthCalledWith(1, 5, [5, 9], 'horizontal');
  jest.spyOn(global.Math, 'random').mockRestore();
});

test('ai places 5 ships', () => {
  const ai = createAi();

  const mockFunction = jest.fn();

  ai.board.placeShip = mockFunction;

  ai.placeShips();

  expect(mockFunction).toHaveBeenCalledTimes(5);
});

test('ai places ships in different locations', () => {
  jest
    .spyOn(global.Math, 'random')
    .mockReturnValueOnce(0.5) // direction: vertical
    .mockReturnValueOnce(0.0) // x : 0
    .mockReturnValueOnce(0.0) // y : 0
    .mockReturnValueOnce(0.5) // this set should be discarded direction: vertical
    .mockReturnValueOnce(0.0) // x : 0
    .mockReturnValueOnce(0.0) // y : 0
    // this should be the 2nd ship
    .mockReturnValueOnce(0.1) // x : 1
    .mockReturnValueOnce(0.1); // y : 1

  const findDuplicates = (arr) => {
    return arr.filter((item, index) => arr.indexOf(item) != index);
  };

  const ai = createAi();

  ai.placeShips();

  const shipLocationsWInfo = ai.board.getShips();
  let shipLocations = [];
  shipLocationsWInfo.forEach((obj) => {
    shipLocations = shipLocations.concat(obj['coordinates']);
  });
  let strLocations = [];
  shipLocations.forEach((x) => strLocations.push(JSON.stringify(x)));
  const noDuplicates = findDuplicates(strLocations).length ? false : true;

  expect(noDuplicates).toEqual(true);
  jest.spyOn(global.Math, 'random').mockRestore();
});

test("ai placed ships don't go over edges", () => {
  jest
    .spyOn(global.Math, 'random')
    .mockReturnValueOnce(0.5) // direction: vertical
    // first ship placed at highest value possible
    // would be placed at 9 if the edge detection didn't work
    .mockReturnValueOnce(0.9);

  const ai = createAi();

  ai.placeShips();

  const shipLocationsWInfo = ai.board.getShips();
  let checkAnyCoordinate = [];
  shipLocationsWInfo.forEach((obj) => {
    checkAnyCoordinate = checkAnyCoordinate.concat(obj['coordinates']);
  });
  checkAnyCoordinate = checkAnyCoordinate.flat();

  expect(Math.max(...checkAnyCoordinate)).toBeLessThan(10);
  jest.spyOn(global.Math, 'random').mockRestore();
});

test('ai hits ship then next attack is first smart attack', () => {
  const ai = createAi();
  const player = createPlayer();
  ai.setPlayer(player);

  const mockFunction = jest.fn();
  player.board.receiveAttack = mockFunction;

  player.board.shipHit = [1, 6];
  ai.attack();

  expect(mockFunction).toHaveBeenCalledWith([2, 6]);
});
