const shipName = 'Carrier';

const tempShips = {
  Carrier: ['[0,1]', '[0,2]'],
  BattleShip: ['[1,1]', '[1,2]'],
  Cruiser: ['[2,1]', '[2,2]'],
  Submarine: ['[3,1]', '[3,2]'],
  Destroyer: ['[4,1]', '[4,2]'],
};

const mockCheckCollision = (coords) => {
  for (let keys in tempShips) {
    for (let i = 0; i < coords.length; i++) {
      let strCoord = JSON.stringify(coords[i]);
      if (tempShips[keys].includes(strCoord)) {
        return false;
      }
    }
  }
  return true;
};

test('check ship location taken return false', () => {
  const shipCoords = [
    [0, 0],
    [0, 1],
  ];
  expect(mockCheckCollision(shipCoords)).toBe(false);
});

test('check ship location is available return true', () => {
  const shipCoords = [
    [9, 9],
    [9, 8],
  ];
  expect(mockCheckCollision(shipCoords)).toBe(true);
});
