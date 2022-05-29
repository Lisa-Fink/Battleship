import { createPlayer, createAi } from '../js/player';

test('player attack', () => {
  const player = createPlayer();
  const ai = createAi();

  const mockFunction = jest.fn();
  ai.board.receiveAttack = mockFunction;

  player.setOpponent(ai);
  player.attack([1, 6]);
  expect(mockFunction).toHaveBeenCalled();
});

test('getAttackCoordinates', () => {
  ai = createAi();
  ai.attack();
});
