////////////////////////////////////////////
// This is the code for a basic snake game
///////////////////////////////////////////

// create the elements of the game
const gameBoard = document.getElementById("gameBoard");
const scoreCard = document.getElementById("scoreCard");
const highScoreCard = document.getElementById("highScoreCard");
const startScreen = document.getElementById("startScreen");
const normalMode = document.getElementById("normalCheck");
const hardMode = document.getElementById("hardCheck");
const difficultyForm = document.getElementById("difficultyForm");
const difficultyTitle = document.getElementById("difficultyTitle");

// set the game constants
const SNAKE_SPEED = 5;
const EXPANSION_RATE = 2;
const SCORE_RATE = 2;
const SCORE_RATE_HARD = 5;
const GRID_SIZE = 21;
// snake starting position
const snakeBody = [{ x: 11, y: 11 }];

let lastRenderTime = 0;
let score = 0;
let highScore = parseInt(localStorage.getItem("localHighScore"));
let hardModeState = false;
let snakeSpeed = 0;
let gameOver =  false;
let newSegments = 0;
let food = getRandomFoodPosition();
let inputDirection = { x: 0, y: 0 };
let lastInputDirection = { x: 0, y: 0 };
let finalScore = document.getElementById("finalScore");

// remove the start screen
function removeStartScreen() {
  if (hardMode.checked) {
    hardModeState = true;
  } else {
    hardModeState = false;
  };
  startScreen.style.display = "none";
};

// update the snakes position
function updateSnake() {
  addSegments();
  const inputDirection = getInputDirection();
  for (let i = snakeBody.length - 2; i >= 0; i--) {
    snakeBody[i + 1] = {...snakeBody[i] };
  }
  snakeBody[0].x += inputDirection.x;
  snakeBody[0].y += inputDirection.y;
};

// draw the snake onto the game board
function drawSnake(gameBoard) {
  snakeBody.forEach(segment => {
    const snakeElement = document.createElement("div");
    snakeElement.style.gridRowStart = segment.y;
    snakeElement.style.gridColumnStart = segment.x;
    snakeElement.classList.add("snake");
    gameBoard.appendChild(snakeElement);
  })
};

// expand the snake when food is eaten
function expandSnake(amount) {
  newSegments += amount;

  if (hardModeState == true) {
    score = score + SCORE_RATE_HARD;
  } else {
    score = score + SCORE_RATE;
  };

  if ( highScore <= score ) {
    localStorage.setItem("localHighScore", score);
  };
};

// check if object is on the snake
function onSnake(position,  { ignoreHead = false } = {}) {
  return snakeBody.some((segment, index) => {
    if (ignoreHead && index === 0) return false;
    return equalPositions(segment, position);
  })
};

// find where the front of the snake is
function getSnakeHead() {
  return snakeBody[0];
};

//
function snakeIntersection() {
  return onSnake(snakeBody[0], { ignoreHead: true });
};

// determine if two positions are equal
function equalPositions(pos1, pos2) {
  return pos1.x === pos2.x && pos1.y === pos2.y;
};

// add a new segment to the snake
function addSegments() {
  for (let i = 0; i < newSegments; i++) {
    snakeBody.push({ ...snakeBody[snakeBody.length - 1] });
  }
  newSegments = 0;
};

// update the position of the food
function updateFood() {
  if (onSnake(food)) {
    if (hardModeState == true) {
      snakeSpeed++;
    };
    expandSnake(EXPANSION_RATE);
    food = getRandomFoodPosition();
  }
};

// draw the food onto the gameboard
function drawFood(gameBoard) {
  const foodElement = document.createElement("div");
  foodElement.style.gridRowStart = food.y;
  foodElement.style.gridColumnStart = food.x;
  foodElement.classList.add("food");
  gameBoard.appendChild(foodElement);
};

// get a random position for the food
function getRandomFoodPosition() {
  let newFoodPosition;
  while (newFoodPosition == null || onSnake(newFoodPosition)) {
    newFoodPosition = randomGridPosition();
  }
  return newFoodPosition;
};

// find a random grid position
function randomGridPosition() {
  return {
    x: Math.floor(Math.random() * GRID_SIZE) + 1,
    y: Math.floor(Math.random() * GRID_SIZE) + 1
  }
};

// check if snake is outside the grid
function outsideGrid(position) {
  return (
    position.x < 1 || position.x > GRID_SIZE ||
    position.y < 1 || position.y > GRID_SIZE
  )
};

// INPUT
window.addEventListener("keyup", e => {
  switch (e.key) {
    case "w":
      if (lastInputDirection.y !== 0) {console.log("I can't go that way!"); break};
      inputDirection = { x: 0, y: -1 };
      break;
    case "s":
      if (lastInputDirection.y !== 0) {console.log("I can't go that way!"); break};
      inputDirection = { x: 0, y: 1 };
      break;
    case "a":
      if (lastInputDirection.x !== 0) {console.log("I can't go that way!"); break};
      inputDirection = { x: -1, y: 0 };
      break;
    case "d":
      if (lastInputDirection.x !== 0) {console.log("I can't go that way!"); break};
      inputDirection = { x: 1, y: 0 };
      break;
    case " ":
      if (startScreen.style.display !== "none") removeStartScreen();
  }
});

function getInputDirection() {
  lastInputDirection = inputDirection;
  return inputDirection;
};


function main(currentTime) {
if (gameOver) {
  difficultyForm.style.display = "none";
  difficultyTitle.style.display = "none";
  document.getElementById("moreInfo").textContent = "Press Space To Refresh";
  startScreen.style.display = "block";
  window.addEventListener("keyup", e => {
    if (e.key == " ") {
      window.location = "snake.html";
    };
  });
  return;
}

  const secondsSinceLastRender = (currentTime - lastRenderTime) / 1000;
  window.requestAnimationFrame(main);
  if (secondsSinceLastRender < 1 / (SNAKE_SPEED + (snakeSpeed / 3))) return;

  lastRenderTime = currentTime;

  update();
  draw();
};

window.requestAnimationFrame(main);

function update() {
  updateSnake();
  updateFood();
  checkDeath();
};

function draw() {
  gameBoard.innerHTML = "";
  scoreCard.innerHTML = "";
  highScoreCard.innerHTML = "";
  drawSnake(gameBoard);
  drawFood(gameBoard);
  drawScore(scoreCard);
  drawScore(highScoreCard);
};

function checkDeath() {
  gameOver = outsideGrid( getSnakeHead() ) || snakeIntersection();
};

function drawScore() {
  scoreCard.innerHTML = "Score: " + score;
  if ( highScore >= score ) {
    highScoreCard.innerHTML = "High Score: " + highScore;
  } else {
    highScoreCard.innerHTML = "High Score: " + score;
  };
  if (score == "0") { finalScore.innerHTML = "High Score: " + highScore }
  else { finalScore.innerHTML = "Your Score: " + score; };
};
