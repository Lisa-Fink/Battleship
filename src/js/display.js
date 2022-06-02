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
  boardLabels(box);
  return box;
};

const boardLabels = (box) => {
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  const columns = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  for (let i = 1; i <= rows.length; i++) {
    let rowTile = document.createElement('div');
    rowTile.textContent = rows[i - 1];
    rowTile.style = `grid-area: ${i + 1}/1/${i + 2}/2; font-weight:800`;
    let columnTile = document.createElement('div');
    columnTile.textContent = columns[i - 1];
    columnTile.style = `grid-area: 1/${i + 1}/2/${i + 2}; font-weight:800`;
    box.appendChild(rowTile);
    box.appendChild(columnTile);
  }
  const corner = document.createElement('div');
  corner.style = 'grid-area: 1/1/2/2';
  box.appendChild(corner);
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

const getSettings = (playerObj) => {
  const startBox = document.createElement('dialog');
  startBox.id = 'start-box';
  document.body.appendChild(startBox);

  const welcomeH2 = document.createElement('h2');
  welcomeH2.textContent = 'Welcome to BATTLESHIP';
  const welcomeText = document.createElement('p');
  welcomeText.textContent = 'Place your battleships:';

  startBox.appendChild(welcomeH2);
  startBox.appendChild(welcomeText);

  const form = document.createElement('form');
  form.data = playerObj;
  form.method = 'dialog';
  form.appendChild(createShip('Carrier', 5));
  form.appendChild(createShip('Battleship', 4));
  form.appendChild(createShip('Cruiser', 3));
  form.appendChild(createShip('Submarine', 3));
  form.appendChild(createShip('Destroyer', 2));

  startBox.appendChild(form);

  const submitBtn = document.createElement('button');
  submitBtn.textContent = 'Start Game';
  const submitDiv = document.createElement('div');
  submitDiv.appendChild(submitBtn);
  const submitInvalid = document.createElement('span');
  submitInvalid.id = 'submit-invalid';
  submitInvalid.className = 'invalid';
  submitDiv.appendChild(submitInvalid);

  form.appendChild(submitDiv);
  form.addEventListener('submit', processStartForm.validateForm);

  startBox.showModal();
};

const createShip = (name, length) => {
  const ship = document.createElement('p');
  const shipLabel = document.createElement('label');
  shipLabel.className = 'ship-label invalid';
  shipLabel.data = length;
  shipLabel.id = name;
  shipLabel.textContent = `${name} - ${length} holes: `;

  shipLabel.appendChild(createSelect('direction', ['horizontal', 'vertical']));

  shipLabel.appendChild(
    createSelect('A-Z', ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'])
  );
  shipLabel.appendChild(createSelect('1-10', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]));

  const validateBox = document.createElement('span');

  shipLabel.appendChild(validateBox);

  ship.appendChild(shipLabel);

  return ship;
};

const createSelect = (defaultText, options) => {
  const select = document.createElement('select');
  select.name = defaultText;
  select.required = true;
  const defaultOption = document.createElement('option');
  defaultOption.value = 'default';
  defaultOption.textContent = `${defaultText}...`;
  select.appendChild(defaultOption);

  options.forEach((option) => {
    let newOption = document.createElement('option');
    newOption.textContent = option;
    select.appendChild(newOption);
  });
  select.addEventListener('change', processStartForm.validateSelections);
  return select;
};

const processStartForm = (() => {
  const tempShips = {
    Carrier: [],
    Battleship: [],
    Cruiser: [],
    Submarine: [],
    Destroyer: [],
  };

  const validateSelections = (e) => {
    const label = e.target.parentElement;
    const shipLen = e.target.parentElement.data;
    const direction = e.target.parentElement.children.direction.value;
    const x = Number(e.target.parentElement.children['1-10'].value) - 1;
    const y = convertToNum(e.target.parentElement.children['A-Z'].value);
    const validateBox = e.target.parentElement.children[3];
    const shipName = e.target.parentElement.id;
    const player = e.target.form.data;

    tempShips[shipName] = [];

    if (
      (direction == 'horizontal' && x + shipLen - 1 > 9) |
      (direction == 'vertical' && y + shipLen - 1 > 9)
    ) {
      label.className = 'ship-label invalid';
      validateBox.innerText = 'X not enough space';
    } else if ((direction == 'default') | (!x && x != 0) | (y == undefined)) {
      label.className = 'ship-label invalid';
      validateBox.innerText = 'X need all selections';
    } else {
      // check for ship collision
      const shipCoords = player.board.getCoordinates(
        shipLen,
        [x, y],
        direction
      );
      const isSpaceAvailable = checkCollision(shipCoords);

      if (isSpaceAvailable) {
        label.className = 'ship-label valid';
        validateBox.innerText = 'valid';
        shipCoords.forEach((coord) =>
          tempShips[shipName].push(JSON.stringify(coord))
        );
      } else {
        label.className = 'ship-label invalid';
        validateBox.innerText = 'X space unavailable';
      }
    }
  };
  const checkCollision = (coords) => {
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

  const validateForm = (e) => {
    e.preventDefault();
    let isValid = true;
    e.target.childNodes.forEach((child) => {
      if (child.childNodes[0].className == 'ship-label invalid') {
        isValid = false;
      }
    });
    if (isValid == true) {
      processShips(e);
    } else {
      const submitInvalid = document.getElementById('submit-invalid');
      submitInvalid.textContent = 'Invalid ships';
    }
  };

  const processShips = (e) => {
    const player = e.target.data;
    for (let i = 0; i < 13; i += 3) {
      let len = i == 0 ? 5 : i == 3 ? 4 : i == 12 ? 2 : 3;
      let direction = e.target[i].value;
      let x = Number(e.target[i + 2].value - 1);
      let y = convertToNum(e.target[i + 1].value);
      let coordinates = [x, y];
      player.board.placeShip(len, coordinates, direction);
      drawShips(player);
      const startBox = document.getElementById('start-box');
      startBox.close();
    }
  };

  const convertToNum = (letter) => {
    const keys = {
      A: 0,
      B: 1,
      C: 2,
      D: 3,
      E: 4,
      F: 5,
      G: 6,
      H: 7,
      I: 8,
      J: 9,
    };
    return keys[letter];
  };

  return { validateForm, validateSelections };
})();

export { drawBoards, drawShips, updateBoard, gameOver, getSettings };
