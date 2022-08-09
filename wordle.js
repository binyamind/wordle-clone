// startGame
const keys = {
  keyRow0: "QWERTYUIOP",
  keyRow1: "ASDFGHJKL",
  keyRow2: ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "x"],
};
let NotdoneUpdatingUI=false;
let stateOfGame = {
  row: 0,
  col: 0,
  grid: Array(6)
    .fill()
    .map(() => Array(5).fill("")),
  currentGuess: [],
  soulotion: null,
  isWinner: false,
  wasRowChecked: false,
};
async function startGame() {
  await getRandomWord();
  drawBoard();
  createKeyBoardListenrs();
  createKeyBorad();
}
async function getRandomWord() {
  try {
    const url = `https://random-word-api.herokuapp.com/word?length=5`;
    const res = await fetch(url).then((res) => res.json());
    stateOfGame.soulotion = res[0].toUpperCase();
    console.log(stateOfGame.soulotion);
  } catch (error) {
    throw new Error("There is some issues please try again!!!");
  }
}
function createKeyBorad() {
  Object.values(keys).reduce((acc, curr) => {
    const keyBoard = document.getElementById("key-board");
    for (let index = 0; index < curr.length; index++) {
      const ele = document.createElement("button");
      ele.id = curr[index];
      ele.className = "key-board-letter";
      ele.textContent = curr[index];
      ele.addEventListener("click", getClickEvent);
      keyBoard.appendChild(ele);
    }
    const keyRows = document.createElement("div");
    keyRows.className = "keyRow";
    keyBoard.appendChild(keyRows);
  }, {});
}
function getClickEvent(e) {
  if (e.target.innerText === "ENTER") {
    chehkForWinner();
  } else if (e.target.innerText === "x") {
    deleteLetter();
  } else {
    addNewLetter(e.target.innerText, stateOfGame.row, stateOfGame.col);
  }
}
function createKeyBoardListenrs() {
  window.addEventListener("keydown", (e) => {
    const { key } = e;
    if (key === "Enter") {
      chehkForWinner();
    }
    if (key === "Backspace") {
      deleteLetter();
    }
    if (isLetter(key)&&!NotdoneUpdatingUI) {
      addNewLetter(key, stateOfGame.row, stateOfGame.col);
    }
  });
}
async function chehkForWinner() {
  
  if (stateOfGame.col < 5) return;
  stateOfGame.wasRowChecked = false;
  let doneAnimating = false;
  await updateBoardUI();
  await updateKeyBoardUI();

  doneAnimating = true;
  if (doneAnimating) {
    stateOfGame.col = 0;
    stateOfGame.row++;
  }

  const letterArrayToString = stateOfGame.currentGuess.reduce(
    (acc, curr) => (acc += curr.letter),
    ""
  );

  if (letterArrayToString === stateOfGame.soulotion) {
    stateOfGame.isWinner = true;
    await showWiningMessage();
  }
  stateOfGame.currentGuess = [];
  NotdoneUpdatingUI= false;
}
async function showWiningMessage() {
  const winCard = document.createElement("div");
  winCard.className = "wincard";
  const mesages = document.createElement("h1");
  mesages.className = "win";
  mesages.textContent = "Winner very good!!!";
  winCard.appendChild(mesages);
  const wraper = document.getElementById("wraper").appendChild(winCard);
  setTimeout(async () => {
    const wraper = document.getElementById("wraper");
    wraper.classList.add('remove');
    document.getElementById("wraper").removeChild(winCard);    
  }, 2500);
  
}
async function updateKeyBoardUI() {
  stateOfGame.currentGuess.forEach(async (ele) => {
    await document.getElementById(`${ele.letter}`).classList.add(`${ele.class}`);
  });
}
async function updateBoardUI() {
  const animation__doration = 750;
  return new Promise((resolve) => {
    stateOfGame.currentGuess.forEach(async (ele, index) => {
      setTimeout(() => {
        const box = document.getElementById(`box${ele.row}${ele.col}`);
        box.classList.add(`${ele.class}`, "animate");
      }, (index * animation__doration) / 2);
    });
    setTimeout(resolve, animation__doration * stateOfGame.currentGuess.length);
  });
}
function deleteLetter() {
  if (
    (stateOfGame.row === 0 && stateOfGame.col === 0) ||
    (stateOfGame.row >= 6 && stateOfGame.col === 0) ||
    stateOfGame.col === 0
  )
    return;
 // console.log(stateOfGame.currentGuess);
  stateOfGame.grid[stateOfGame.row][stateOfGame.col] = "";
  stateOfGame.currentGuess.splice(
    stateOfGame.currentGuess[stateOfGame.col - 1],
    1
  );
  stateOfGame.col--;

  document.getElementById(
    `box${stateOfGame.row}${stateOfGame.col}`
  ).textContent = "";
}
function addNewLetter(letter) {
  if (stateOfGame.isWinner) return;
  if ((stateOfGame.row >= 6 && stateOfGame.col === 0) || stateOfGame.col >= 5)
    return;
  //console.log('addding numbers '+letter);
  addLetterToGridAndUI(letter);
  stateOfGame.col++;
}
function addLetterToGridAndUI(letter) {
  const solution = [...stateOfGame.soulotion];
  let classOfCol = "empty";
  if (letter.toUpperCase() === solution[stateOfGame.col]) {
    classOfCol = "right";
  } else if (solution.includes(letter.toUpperCase())) {
    classOfCol = "wrong";
  }

  const obj = {
    letter: letter.toUpperCase(),
    row: stateOfGame.row,
    col: stateOfGame.col,
    class: classOfCol,
  };
  stateOfGame.currentGuess.push(obj);
  stateOfGame.grid[stateOfGame.row][stateOfGame.col] = letter;
  document.getElementById(
    `box${stateOfGame.row}${stateOfGame.col}`
  ).textContent = letter;
}
function isLetter(letter) {
  const regex = /[A-Za-z]/i;
  return letter.length === 1 && letter.match(regex);
}
function drawBoard() {
  const gameBorad = document.getElementById("game-board");
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 5; col++) {
      const box = document.createElement("div");
      box.className = "box";
      box.id = `box${row}${col}`;
      gameBorad.appendChild(box);
    }
  }
}
startGame();
