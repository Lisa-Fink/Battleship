import createShip from '../js/ship';

// test('create ship object', () => {
//   const shipTest = createShip(3);
//   expect(shipTest.getSize()).toBe(3);
//   expect(shipTest.getHitLoc()).toEqual([]);
//   expect(shipTest.getStatus()).toBeFalsy();
// });

test('hit ship', () => {
  const shipTest = createShip(4);
  shipTest.hit(42);
  expect(shipTest.getHitLoc()).toEqual([42]);
});

test('hit ship twice', () => {
  const shipTest = createShip(4);
  shipTest.hit(42);
  shipTest.hit(44);
  expect(shipTest.getHitLoc()).toEqual([42, 44]);
});

test('is sunk', () => {
  const shipTest = createShip(4);
  shipTest.hit(42);
  expect(shipTest.isSunk()).toBeFalsy();
});

test('is sunk true', () => {
  const shipTest = createShip(1);
  shipTest.hit(42);
  expect(shipTest.isSunk()).toBeTruthy();
});
