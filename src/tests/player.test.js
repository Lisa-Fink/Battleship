import { createPlayer, createAi } from '../js/player';

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
