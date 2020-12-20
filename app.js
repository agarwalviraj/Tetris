document.addEventListener("DOMContentLoaded", () => {
  console.log("1");
  const prev = document.querySelector(".previous-grid");
  const mainDiv = document.querySelector(".grid");

  for (let i = 0; i < 25; i++) {
    const div = document.createElement("div");
    prev.appendChild(div);
  }
  for (let i = 0; i < 200; i++) {
    const div = document.createElement("div");
    mainDiv.appendChild(div);
  }
  const end = document.querySelectorAll(".grid div");
  for (let i = 190; i < 200; i++) {
    end[i].classList.add("block3");
  }

  const startBtn = document.querySelector("button");
  const grid = document.querySelector(".grid");
  const scoreDisplay = document.querySelector(".score-display");
  const linesDisplay = document.querySelector(".lines-display");
  const displaySquares = document.querySelectorAll(".previous-grid div");
  let squares = Array.from(grid.querySelectorAll("div"));
  const width = 10;
  const height = 20;
  let currentPosition = 4;
  let timerId;
  let score = 0;
  let lines = 0;

  //assign functions to keycodes
  function control(e) {
    if (e.keyCode === 39) moveRight();
    else if (e.keyCode === 38) rotate();
    else if (e.keyCode === 37) moveLeft();
    else if (e.keyCode === 40) moveDown();
  }
  window.onload = (event) => {};

  document.addEventListener("keyup", control);

  const lTetromino = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2],
  ];

  const zTetromino = [
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
  ];

  const tTetromino = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1],
  ];

  const oTetromino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
  ];

  const iTetromino = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
  ];

  //Randomly Selecting
  const theTetrominoes = [
    lTetromino,
    zTetromino,
    tTetromino,
    oTetromino,
    iTetromino,
  ];
  let random = Math.floor(Math.random() * theTetrominoes.length);
  let currentRotation = 0;
  let current = theTetrominoes[random][currentRotation];

  //Draw the tiles
  function draw() {
    current.forEach((index) =>
      squares[currentPosition + index].classList.add("block")
    );
  }

  //Undraw the tile
  function undraw() {
    current.forEach((index) =>
      squares[currentPosition + index].classList.remove("block")
    );
  }

  //Move Down
  function moveDown() {
    undraw();
    currentPosition = currentPosition += width;
    draw();
    freeze();
  }

  //move left and prevent collision from shapes moving left
  function moveRight() {
    undraw();
    const isAtRightEdge = current.some(
      (index) => (currentPosition + index) % width === width - 1
    );
    if (!isAtRightEdge) currentPosition += 1;
    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains("block2")
      )
    ) {
      currentPosition -= 1;
    }
    draw();
  }

  function moveLeft() {
    undraw();
    const isAtLeftEdge = current.some(
      (index) => (currentPosition + index) % width === 0
    );
    if (!isAtLeftEdge) currentPosition -= 1;
    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains("block2")
      )
    ) {
      currentPosition += 1;
    }
    draw();
  }

  //Rotate the Tetromino
  function rotate() {
    undraw();
    currentRotation++;
    if (currentRotation === current.length) {
      currentRotation = 0;
    }
    let tetri = theTetrominoes[random][currentRotation];
    let ls = 0,
      gt = 0;
    tetri.forEach((index) => {
      const curr = index + currentPosition;
      if (curr % 10 >= 2) gt++;
      if (curr % 10 < 2) ls++;
    });
    if (gt <= 3) {
      currentRotation--;
      if (currentRotation === -1) {
        currentRotation = 3;
      }
    } else if (gt > 3) {
      current = theTetrominoes[random][currentRotation];
    }
    draw();
  }
  draw();

  const displayWidth = 5;
  const displayIndex = 0;
  let nextRandom = 0;
  const smallTetrominoes = [
    [1, displayWidth + 1, displayWidth * 2 + 1, 2] /* lTetromino */,
    [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1] /* zTetromino */,
    [1, displayWidth, displayWidth + 1, displayWidth + 2] /* tTetromino */,
    [0, 1, displayWidth, displayWidth + 1] /* oTetromino */,
    [
      1,
      displayWidth + 1,
      displayWidth * 2 + 1,
      displayWidth * 3 + 1,
    ] /* iTetromino */,
  ];

  function displayShape() {
    displaySquares.forEach((square) => {
      square.classList.remove("block");
    });
    smallTetrominoes[nextRandom].forEach((index) => {
      displaySquares[displayIndex + index + 1 + displayWidth].classList.add(
        "block"
      );
    });
  }

  //freeze the blocks
  function freeze() {
    if (
      current.some(
        (index) =>
          squares[currentPosition + index + width].classList.contains(
            "block3"
          ) ||
          squares[currentPosition + index + width].classList.contains("block2")
      )
    ) {
      current.forEach((index) =>
        squares[index + currentPosition].classList.add("block2")
      );
      random = nextRandom;
      nextRandom = Math.floor(Math.random() * theTetrominoes.length);
      current = theTetrominoes[random][currentRotation];
      currentPosition = 4;
      draw();
      displayShape();
      gameOver();
      addScore();
    }
  }

  startBtn.addEventListener("click", () => {
    if (timerId) {
      gameOver();
      clearInterval(timerId);
      timerId = null;
    } else {
      draw();
      timerId = setInterval(moveDown, 1000);
      nextRandom = Math.floor(Math.random() * theTetrominoes.length);
      displayShape();
    }
  });

  // Finish Game
  function gameOver() {
    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains("block2")
      )
    ) {
      scoreDisplay.innerHTML = "end";
      clearInterval(timerId);
    }
  }

  //Add Score
  function addScore() {
    for (let currentIndex = 0; currentIndex < 200; currentIndex += width) {
      const row = [
        currentIndex,
        currentIndex + 1,
        currentIndex + 2,
        currentIndex + 3,
        currentIndex + 4,
        currentIndex + 5,
        currentIndex + 6,
        currentIndex + 7,
        currentIndex + 8,
        currentIndex + 9,
      ];

      if (row.every((index) => squares[index].classList.contains("block2"))) {
        score += 10;
        lines += 1;
        scoreDisplay.innerHTML = score;
        linesDisplay.innerHTML = lines;
        row.forEach((index) => {
          squares[index].classList.remove("block2") ||
            squares[index].classList.remove("block");
        });
        const squaresRemoved = squares.splice(currentIndex, width);
        squares = squaresRemoved.concat(squares);
        squares.forEach((cell) => grid.appendChild(cell));
      }
    }
  }
});
