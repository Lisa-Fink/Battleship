const displayedMiss = [[], []];
const displayedShipHit = [[], []]; // player, ai

const drawBoards = (aiObj) => {
  const container = document.createElement('div');

  const h1 = document.createElement('h1');
  h1.textContent = 'BATTLESHIP';
  container.appendChild(h1);

  const playerBox = createBox('player-box');
  const aiBox = createBox('ai-box');
  aiBox.data = aiObj;
  container.appendChild(aiBox);
  container.appendChild(playerBox);
  document.body.appendChild(container);
};

const createBox = (id) => {
  const box = document.createElement('div');
  box.id = id;
  box.className = 'box';
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      let tile = document.createElement('div');
      tile.id = `[${j},${i}]-${id}`;
      tile.className = `${id}-tile`;
      tile.textContent = '0';
      id[0] == 'a' ? tile.addEventListener('click', processAttack) : null;
      box.appendChild(tile);
    }
  }
  return box;
};

const processAttack = (e) => {
  // make sure wasn't already attacked
  if (!e.target.parentElement.data.turn) {
    const coordinates = e.target.id.match(/\d/g);
    // sends the attack
    e.target.parentElement.data.getPlayer().attack(coordinates);
  }
};

const drawShips = (playerObj) => {
  const ships = playerObj.board.getShips();
  for (let ship of ships) {
    let coordinateArr = ship.coordinates;
    coordinateArr.forEach((coordinate) => {
      let tile = document.getElementById(`[${coordinate}]-player-box`);
      tile.textContent = 'S';
      tile.classList.add('ship');
      tile.data = ship;
    });
  }
};

const updateBoard = (playerObj) => {
  const nextTurn = playerObj.getType();
  const index = nextTurn == 'ai' ? 1 : 0;
  const playerChanged = nextTurn;

  const missed = playerObj.board.getMissedAttacks();
  if (missed.length > displayedMiss[index].length) {
    // display new miss
    const newMiss = document.getElementById(
      `[${missed[missed.length - 1]}]-${playerChanged}-box`
    );
    newMiss.textContent = 'X';
    newMiss.classList.add('miss');
    displayedMiss[index].push(missed[missed.length - 1]);
  } else {
    const shipHits = playerObj.board
      .getShips()
      .map((eachShip) => {
        return eachShip.ship.getHitLoc();
      })
      .filter((arr) => arr.length > 0);
    // display new ship hit
    const newestShips = [];
    shipHits.forEach((ship) => newestShips.push(ship[ship.length - 1]));
    const newShipHit = newestShips.filter((ship) => {
      return !JSON.stringify(displayedShipHit).includes(JSON.stringify(ship));
    });
    const newHit = document.getElementById(
      `[${newShipHit}]-${playerChanged}-box`
    );
    newHit.textContent = 'X';
    newHit.classList.add('hit');
    displayedShipHit.push(newShipHit);
  }
};

const gameOver = (winner) => {
  const gameOverDiv = document.createElement('div');
  gameOverDiv.className = 'game-over';
  const h2 = document.createElement('h2');
  const winnerText = document.createElement('div');

  h2.textContent = 'Game Over';
  winnerText.textContent = `${winner} has won the game!`;

  gameOverDiv.appendChild(h2);
  gameOverDiv.appendChild(winnerText);

  document.body.appendChild(gameOverDiv);
};

export { drawBoards, drawShips, updateBoard, gameOver };
