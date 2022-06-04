import createGameboard from '../js/gameboard';

test('place a ship horizontal', () => {
  const gameboard = createGameboard();
  gameboard.placeShip(3, [1, 4], 'horizontal');
  expect(gameboard.getShips()[0]['coordinates']).toEqual([
    [1, 4],
    [2, 4],
    [3, 4],
  ]);
});

test('place a ship vertical', () => {
  const gameboard = createGameboard();
  gameboard.placeShip(4, [1, 6], 'vertical');
  expect(gameboard.getShips()[0]['coordinates']).toEqual([
    [1, 6],
    [1, 7],
    [1, 8],
    [1, 9],
  ]);
});

test('checkShipLocations hitting ship', () => {
  const gameboard = createGameboard();
  gameboard.placeShip(4, [1, 6], 'vertical');
  expect(gameboard.checkShipLocations([1, 6])).toEqual({
    attackLoc: [1, 6],
    ship: {
      getHitLoc: expect.any(Function),
      hit: expect.any(Function),
      isSunk: expect.any(Function),
    },
  });
});

test('checkShipLocations not hitting ship', () => {
  const gameboard = createGameboard();
  gameboard.placeShip(4, [1, 6], 'vertical');
  expect(gameboard.checkShipLocations([5, 9])).toEqual(false);
});

test('checkShipLocations no ships', () => {
  // when ai is placing first ship
  const gameboard = createGameboard();
  expect(gameboard.checkShipLocations([0, 0])).toBe(false);
});

test('sendHitToShip', () => {
  const gameboard = createGameboard();
  const mockFunction = jest.fn();
  const mockShip = {
    getHitLoc: expect.any(Function),
    isSunk: expect.any(Function),
    hit: mockFunction,
  };
  gameboard.sendHitToShip(mockShip, [1, 6]);
  expect(mockFunction).toHaveBeenCalled();
});

test('missedAttack checking with getMissedAttacks', () => {
  const gameboard = createGameboard();
  gameboard.missedAttack([1, 6]);
  expect(gameboard.getMissedAttacks()).toEqual([[1, 6]]);
});

test('receiveAttack hitting ship sends correct function', () => {
  const gameboard = createGameboard();
  gameboard.placeShip(4, [1, 6], 'vertical');

  const mockFunction = jest.fn();
  gameboard.sendHitToShip = mockFunction;

  gameboard.receiveAttack([1, 6]);
  expect(mockFunction).toHaveBeenCalled();
});

test('receiveAttack missing ship sends correct function', () => {
  const gameboard = createGameboard();
  gameboard.placeShip(4, [1, 6], 'vertical');

  const mockFunction = jest.fn();
  gameboard.missedAttack = mockFunction;

  gameboard.receiveAttack([9, 9]);
  expect(mockFunction).toHaveBeenCalled();
});

test('checkAllShipsSunk true', () => {
  const gameboard = createGameboard();
  gameboard.placeShip(2, [1, 6], 'vertical');
  gameboard.receiveAttack([1, 6]);
  gameboard.receiveAttack([1, 7]);
  expect(gameboard.checkAllShipsSunk()).toBe(true);
});

test('checkAllShipsSunk false', () => {
  const gameboard = createGameboard();
  gameboard.placeShip(2, [1, 6], 'vertical');
  gameboard.receiveAttack([1, 6]);
  expect(gameboard.checkAllShipsSunk()).toBe(false);
});

test('shipHit stores hit when attacked', () => {
  const gameboard = createGameboard();
  gameboard.placeShip(2, [9, 6], 'vertical');
  gameboard.receiveAttack([9, 6]);
  expect(gameboard.shipHit).toEqual([9, 6]);
});

test("shipHit doesn't store hit when attack misses", () => {
  const gameboard = createGameboard();
  gameboard.placeShip(2, [9, 6], 'vertical');
  gameboard.receiveAttack([8, 6]);
  expect(gameboard.shipHit).toEqual(false);
});
