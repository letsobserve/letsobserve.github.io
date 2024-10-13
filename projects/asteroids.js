const FPS = 30; // frames per second
const FRICTION = 0.5; // friction coefficient of space (0 = no friction, 1 = lots of friction)
const LASER_DIST = 0.6 // max distance laser can travel
const LASER_MAX = 30; // max amount of lasers on screen
const LASER_SPD = 500; // speed of laser on pixels per second
const ROIDS_JAG = 0.2; // jaggedness of asteroids
const ROIDS_NUM = 3; // starting number of asteroids
const ROIDS_SIZE = 80; // starting size of asteroids in pixels
const ROIDS_SPD = 30; // max starting speed of asteroids in pixels per second
const ROIDS_VERT = 10; // average number of vertices on each asteroids
const ROIDS_PTS_LGE = 20; // points for a large asteroid
const ROIDS_PTS_MED = 35; // points for a medium asteroid
const ROIDS_PTS_SML = 50; // points for a small asteroid
const SHIP_SIZE = 30; // ship height in pixels
const SHIP_THRUST = 2; // acceleration of the ship in pixels per second per second
const SHIP_BLINK_DUR = 0.2; // duration of blink during invulnerability
const SHIP_INV_DUR = 3; // duration of invulnerability
const SHIP_EXPLODE_DUR = 0.5; // duration of ship explosion
const LASER_EXPLODE_DUR = 0.2; // duration of the laser explosion
const TEXT_FADE_TIME = 4; // text fase time in seconds
const TEXT_SIZE = 40; // text font size in pixels
const GAME_LIVES = 3; // starting number of lives
const SAVE_KEY_SCORE = "highScore"; // save key for localStorage of high score
const TURN_SPEED = 180; // turn speed in degrees per second
const SHOW_BOUNDING = false; // show or hide collision bounds
const SHOW_CENTRE_DOT = false; // show or hide ship's centre dot

/** @type {HTMLCanvasElement} */
var canv = document.getElementById("gameCanvas");
var ctx = canv.getContext("2d");
var dimension = [document.documentElement.clientWidth, document.documentElement.clientHeight];
canv.width = dimension[0];
canv.height = dimension[1];

// set up the game parameters
var level, lives, score, highScore, roids, ship, text, textAlpha;
newGame();

// set up the asteroids
var roids = [];
createAsteroidBelt();

// set up event handlers
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

// set up the game loop
setInterval(update, 1000 / FPS);

function createAsteroidBelt() {
  roids = [];
  var x;
  var y;
  for (var i = 0; i < ROIDS_NUM + level; i++) {
    do {
      x = Math.floor(Math.random() * canv.width);
      y = Math.floor(Math.random() * canv.height);
    } while (distBetweenPoints(ship.x, ship.y, x, y) < ROIDS_SIZE);
    roids.push(newAsteroid(x, y, Math.ceil(ROIDS_SIZE / 2)));
  }
};

function destroyAsteroid(index) {
  var x = roids[index].x;
  var y = roids[index].y;
  var r = roids[index].r;

  // split the asteroid in 2
  if (r == Math.ceil(ROIDS_SIZE / 2)) {
    roids.push(newAsteroid(x, y, Math.ceil(ROIDS_SIZE / 4)));
    roids.push(newAsteroid(x, y, Math.ceil(ROIDS_SIZE / 4)));
    score += ROIDS_PTS_LGE;
  } else if (r == Math.ceil(ROIDS_SIZE / 4)) {
    roids.push(newAsteroid(x, y, Math.ceil(ROIDS_SIZE / 8)));
    roids.push(newAsteroid(x, y, Math.ceil(ROIDS_SIZE / 8)));
    score += ROIDS_PTS_MED;
  } else {
    score += ROIDS_PTS_SML;
  }

  // check high score
  if(score > highScore) {
    highScore = score;
    localStorage.setItem(SAVE_KEY_SCORE, highScore);
  }

  // destroy the asteroid
  roids.splice(index, 1);


  // new level when all asteroids destroyed
  if (roids.length == 0) {
    level++;
    newLevel();
  }
}

function distBetweenPoints(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};

function drawShip(x, y, a, color = "white") {
  ctx.fillStyle = "black";
  ctx.strokeStyle = color;
  ctx.lineWidth = SHIP_SIZE / 20;
  ctx.beginPath();
  ctx.moveTo( // nose of ship
    x + 4 / 3 * ship.r * Math.cos(a),
    y - 4 / 3 * ship.r * Math.sin(a)
  );
  ctx.lineTo( // rear left
    x - ship.r * (2 / 3 * Math.cos(a) + Math.sin(a)),
    y + ship.r * (2 / 3 * Math.sin(a) - Math.cos(a))
  );
  ctx.lineTo( // rear right
    x - ship.r * (2 / 3 * Math.cos(a) - Math.sin(a)),
    y + ship.r * (2 / 3 * Math.sin(a) + Math.cos(a))
  );
  ctx.closePath();
  ctx.stroke();
}

function explodeShip() {
  ship.explodeTime = Math.ceil(SHIP_EXPLODE_DUR * FPS);
};

function gameOver() {
  ship.dead = true;
  text = "Game Over";
  textAlpha = 1.0;
}

function keyDown(/** @type {KeyboardEvent} */ ev) {
  ev.preventDefault();
  if (ship.dead) {return;};
  switch(ev.keyCode) {
    case 37: // left arrow (rotate ship left)
    case 65: // A
    ship.rot = TURN_SPEED / 180 * Math.PI / FPS;
    break;
    case 38: // up arrow (thrust the ship forward)
    case 87: // W
    ship.thrusting = true;
    break;
    case 39: // right arrow (rotate ship right)
    case 68: // D
    ship.rot = -TURN_SPEED / 180 * Math.PI / FPS;
    break;
    case 32:
    shootLaser();
    break;
  };
};

function keyUp(/** @type {KeyboardEvent} */ ev) {
  ev.preventDefault();
  if (ship.dead) {return;};
  switch(ev.keyCode) {
    case 37:
    case 65: // left arrow (stop rotating left)
    ship.rot = 0;
    break;
    case 38:
    case 87: // up arrow (stop thrusting)
    ship.thrusting = false;
    break;
    case 39:
    case 68: // right arrow (stop rotating right)
    ship.rot = 0;
    break;
    case 32: // spacebar (stop shooting)
    ship.canShoot = true;
    break;
  };
};

function newAsteroid(x, y, r) {
  var lvlMult = 1 + 0.1 * level;
  var roid = {
    a: Math.random() * Math.PI * 2, // in radians
    r: r,
    vert: Math.floor(Math.random() * (ROIDS_VERT + 1) + ROIDS_VERT / 2),
    offs: [],
    x: x,
    y: y,
    xv: Math.random() * ROIDS_SPD * lvlMult / FPS * (Math.random() < 0.5 ? 1 : -1),
    yv: Math.random() * ROIDS_SPD * lvlMult / FPS * (Math.random() < 0.5 ? 1 : -1)
  };
  // create the vertex offsets array
  for (var i = 0; i < roid.vert; i++) {
    roid.offs.push(Math.random() * ROIDS_JAG * 2 + 1 - ROIDS_JAG);
  }
  return roid;
};

function newGame() {
  level = 0;
  lives = GAME_LIVES;
  score = 0;
  ship = newShip();

  // get the high score
  var scoreStr = localStorage.getItem(SAVE_KEY_SCORE);
  if (scoreStr == null) {
    highScore = 0;
  } else {
    highScore = parseInt(scoreStr);
  };
  newLevel();
};

function newLevel() {
  text = "Level: " + (level + 1);
  textAlpha = 1.0;
  createAsteroidBelt();
};

function newShip() {
  return {
    x: canv.width / 2,
    y: canv.height / 2,
    r: SHIP_SIZE / 2,
    a: 90 / 180 * Math.PI, // convert to radians
    blinkTime: Math.ceil(SHIP_BLINK_DUR * FPS),
    blinkNumber: Math.ceil(SHIP_INV_DUR / SHIP_BLINK_DUR),
    rot: 0,
    thrusting: false,
    thrust: {
      x: 0,
      y: 0
    },
    explodeTime: 0,
    canShoot: true,
    lasers: [],
    dead: false
  };
};

function shootLaser() {
  //create laser object
  if (ship.canShoot && ship.lasers.length < LASER_MAX) {
    ship.lasers.push({ // from nose of ship
      x: ship.x + 4 / 3 * ship.r * Math.cos(ship.a),
      y: ship.y - 4 / 3 * ship.r * Math.sin(ship.a),
      xv: LASER_SPD * Math.cos(ship.a) / FPS,
      yv: -LASER_SPD * Math.sin(ship.a) / FPS,
      dist: 0,
      explodeTime: 0
    });
  };
  // prevent further shooting
  ship.canShoot = false;
};

function update() {
  var blinkOn = ship.blinkNumber % 2 == 0;
  var exploding = ship.explodeTime > 0;
  // draw space
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canv.width, canv.height);
  // thrust the ship
  if (ship.thrusting && !ship.dead) {
    ship.thrust.x += SHIP_THRUST * Math.cos(ship.a) / FPS;
    ship.thrust.y -= SHIP_THRUST * Math.sin(ship.a) / FPS;
    // draw the thruster
    if (!exploding && blinkOn) {
      ctx.fillStyle = "red";
      ctx.strokeStyle = "yellow";
      ctx.lineWidth = SHIP_SIZE / 10;
      ctx.beginPath();
      ctx.moveTo( // rear left
        ship.x - ship.r * (2 / 3 * Math.cos(ship.a) + 0.5 * Math.sin(ship.a)),
        ship.y + ship.r * (2 / 3 * Math.sin(ship.a) - 0.5 * Math.cos(ship.a))
      );
      ctx.lineTo( // rear centre (behind the ship)
        ship.x - ship.r * 5 / 3 * Math.cos(ship.a),
        ship.y + ship.r * 5 / 3 * Math.sin(ship.a)
      );
      ctx.lineTo( // rear right
        ship.x - ship.r * (2 / 3 * Math.cos(ship.a) - 0.5 * Math.sin(ship.a)),
        ship.y + ship.r * (2 / 3 * Math.sin(ship.a) + 0.5 * Math.cos(ship.a))
      );
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    };
  } else {
    // apply friction (slow the ship down when not thrusting)
    ship.thrust.x -= FRICTION * ship.thrust.x / FPS;
    ship.thrust.y -= FRICTION * ship.thrust.y / FPS;
  };
  // draw the ship
  if (!exploding) {
    if (blinkOn && !ship.dead) {
      drawShip(ship.x, ship.y, ship.a);
    };
    // handle blinking
    if (ship.blinkNumber > 0) {
      // reduce blink time
      ship.blinkTime--;
      // reduce the blink number
      if (ship.blinkTime == 0) {
        ship.blinkTime = Math.ceil(SHIP_BLINK_DUR * FPS);
        ship.blinkNumber--;
      };
    };
  } else {
    // draw the explosion
    ctx.fillStyle = "darkred";
    ctx.beginPath();
    ctx.arc(ship.x, ship.y, ship.r * 1.7, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(ship.x, ship.y, ship.r * 1.4, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.fillStyle = "orange";
    ctx.beginPath();
    ctx.arc(ship.x, ship.y, ship.r * 1.1, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.fillStyle = "yellow";
    ctx.beginPath();
    ctx.arc(ship.x, ship.y, ship.r * 0.8, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(ship.x, ship.y, ship.r * 0.5, 0, Math.PI * 2, false);
    ctx.fill();
  };
  if(SHOW_BOUNDING) {
    ctx.strokeStyle = "lime";
    ctx.lineWidth = SHIP_SIZE / 10;
    ctx.beginPath();
    ctx.moveTo( // nose of ship
      ship.x + 4 / 3 * ship.r * Math.cos(ship.a),
      ship.y - 4 / 3 * ship.r * Math.sin(ship.a)
    );
    ctx.lineTo( // rear left
      ship.x - ship.r * (2 / 3 * Math.cos(ship.a) + Math.sin(ship.a)),
      ship.y + ship.r * (2 / 3 * Math.sin(ship.a) - Math.cos(ship.a))
    );
    ctx.lineTo( // rear right
      ship.x - ship.r * (2 / 3 * Math.cos(ship.a) - Math.sin(ship.a)),
      ship.y + ship.r * (2 / 3 * Math.sin(ship.a) + Math.cos(ship.a))
    );
    ctx.closePath();
    ctx.stroke();
  };
  // draw the asteroids
  var x, y, r, a, vert, offs;
  for (var i = 0; i < roids.length; i++) {
    ctx.strokeStyle = "slategrey";
    ctx.lineWidth = SHIP_SIZE / 20;
    // get asteroid properties
    x = roids[i].x;
    y = roids[i].y;
    r = roids[i].r;
    a = roids[i].a;
    vert = roids[i].vert;
    offs = roids[i].offs;
    // draw a path
    ctx.beginPath();
    ctx.moveTo(
      x + r * offs[0] * Math.cos(a),
      y + r * offs[0] * Math.sin(a)
    );
    // draw the polygon
    for (var j = 1; j < vert; j++) {
      ctx.lineTo(
        x + r * offs[j] * Math.cos(a + j * Math.PI * 2 / vert),
        y + r * offs[j] * Math.sin(a + j * Math.PI * 2 / vert)
      );
    };
    ctx.closePath();
    ctx.stroke();
    // collision bounds
    if(SHOW_BOUNDING) {
      ctx.strokeStyle = "lime";
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2, false);
      ctx.stroke();
    };
  };
  // centre dot
  if (SHOW_CENTRE_DOT) {
    ctx.fillStyle = "red";
    ctx.fillRect(ship.x - 1, ship.y - 1, 2, 2);
  };
  // draw the lasers
  for(var i = 0; i < ship.lasers.length; i++) {
    if (ship.lasers[i].explodeTime == 0) {
      ctx.fillStyle = "red";
      ctx.strokeStyle = "salmon";
      ctx.lineWidth = SHIP_SIZE / 5;
      ctx.beginPath();
      ctx.arc(ship.lasers[i].x, ship.lasers[i].y, SHIP_SIZE / 10, 0, Math.PI * 2, false);
      ctx.fill();
      ctx.stroke();
    } else {
      // draw the explosion
      ctx.fillStyle = "red";
      ctx.lineWidth = SHIP_SIZE / 5;
      ctx.beginPath();
      ctx.arc(ship.lasers[i].x, ship.lasers[i].y, ship.r * 0.75, 0, Math.PI * 2, false);
      ctx.fill();
      ctx.fillStyle = "yellow";
      ctx.lineWidth = SHIP_SIZE / 5;
      ctx.beginPath();
      ctx.arc(ship.lasers[i].x, ship.lasers[i].y, ship.r * 0.55, 0, Math.PI * 2, false);
      ctx.fill();
      ctx.fillStyle = "white";
      ctx.lineWidth = SHIP_SIZE / 5;
      ctx.beginPath();
      ctx.arc(ship.lasers[i].x, ship.lasers[i].y, ship.r * 0.35, 0, Math.PI * 2, false);
      ctx.fill();
    };
  };
  // draw the game text
  if (textAlpha >= 0) {
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "rgba(255, 255, 255, " + textAlpha +")";
    ctx.font = "small-caps " + TEXT_SIZE + "px arial";
    ctx.fillText(text, canv.width / 2, canv.height * 0.85);
    textAlpha -= (1.0 / TEXT_FADE_TIME / FPS);
  } else if (ship.dead) {
    newGame();
  };
  // draw the lives
  var livesColor;
  for (var i = 0; i < lives; i++) {
    livesColor = exploding && i == lives - 1 ? "red" : "white";
    drawShip(SHIP_SIZE + i * SHIP_SIZE * 1.2, SHIP_SIZE, 0.5 * Math.PI, livesColor);
  };
  // draw the score
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "white";
  ctx.font = (TEXT_SIZE * 0.75) + "px arial";
  ctx.fillText("Score: " + score, canv.width - SHIP_SIZE / 2, SHIP_SIZE * 1.2);
  // draw the high score
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "white";
  ctx.font = (TEXT_SIZE * 0.45) + "px arial";
  ctx.fillText("High Score: " + highScore, canv.width / 2, SHIP_SIZE * 1.2);
  // detect laser hits on asteroids
  var ax, ay, ar, lx, ly;
  for (var i = roids.length - 1; i >= 0; i--) {
    // grab the asteroid properties
    ax = roids[i].x;
    ay = roids[i].y;
    ar = roids[i].r;
    // loop over the lasers
    for ( var j = ship.lasers.length - 1; j >= 0; j--) {
      // grab the laser properties
      lx = ship.lasers[j].x;
      ly = ship.lasers[j].y;
      // detect hits
      if (ship.lasers[j].explodeTime == 0 && distBetweenPoints(ax, ay, lx, ly) < ar) {
        // destroy the asteroid and explode laser
        destroyAsteroid(i);
        ship.lasers[j].explodeTime = Math.ceil(LASER_EXPLODE_DUR * FPS);
        break;
      };
    };
  };
  // check for asteroid collision
  if (!exploding) {
    // check when not blinking
    if (ship.blinkNumber == 0 && !ship.dead) {
      for (var i = 0; i < roids.length; i++) {
        if (distBetweenPoints(ship.x, ship.y, roids[i].x, roids[i].y) < ship.r + roids[i].r) {
          explodeShip();
          destroyAsteroid(i);
          break;
        };
      };
    };
    // rotate the ship
    ship.a += ship.rot;
    // move the ship
    ship.x += ship.thrust.x;
    ship.y += ship.thrust.y;
  } else {
    // reduce the explode time
    ship.explodeTime--;
    // reset the ship
    if (ship.explodeTime == 0) {
      lives--;
      if (lives == 0) {
        gameOver();
      } else {
        ship = newShip();
      };
    };
  };
  // handle edge of screen
  if (ship.x < 0 - ship.r) {
    ship.x = canv.width + ship.r;
  } else if (ship.x > canv.width + ship.r) {
    ship.x = 0 - ship.r;
  };
  if (ship.y < 0 - ship.r) {
    ship.y = canv.height + ship.r;
  } else if (ship.y > canv.height + ship.r) {
    ship.y = 0 - ship.r;
  };

  // move the lasers
  for ( var i = ship.lasers.length - 1; i >= 0 ; i--) {
    // check distance travelled
    if (ship.lasers[i].dist > LASER_DIST * canv.width) {
      ship.lasers.splice(i, 1);
      continue;
    };
    // handle the explosion
    if (ship.lasers[i].explodeTime > 0) {
      ship.lasers[i].explodeTime--;
      // destroy the laser after the duration
      if (ship.lasers[i].explodeTime == 0) {
        ship.lasers.splice(i, 1);
        continue;
      };
    } else {
      // move the laser
      ship.lasers[i].x += ship.lasers[i].xv;
      ship.lasers[i].y += ship.lasers[i].yv;
      // calculate the distance travelled
      ship.lasers[i].dist += Math.sqrt(Math.pow(ship.lasers[i].xv, 2) + Math.pow(ship.lasers[i].yv, 2));
      // handle edge of screen
      if (ship.lasers[i].x < 0) {
        ship.lasers[i].x = canv.width;
      } else if (ship.lasers[i].x > canv.width) {
        ship.lasers[i].x = 0;
      };
      if (ship.lasers[i].y < 0) {
        ship.lasers[i].y = canv.height;
      } else if (ship.lasers[i].y > canv.height) {
        ship.lasers[i].y = 0;
      };
    };
  };
  // move the asteroids
  for (var i = 0; i < roids.length; i++) {
    roids[i].x += roids[i].xv;
    roids[i].y += roids[i].yv;
    // handle the edge of screen
    if (roids[i].x < 0 - roids[i].r) {
      roids[i].x = canv.width + roids[i].r;
    } else if (roids[i].x > canv.width + roids[i].r) {
      roids[i].x = 0 - roids[i].r;
    };
    if (roids[i].y < 0 - roids[i].r) {
      roids[i].y = canv.height + roids[i].r;
    } else if (roids[i].y > canv.height + roids[i].r) {
      roids[i].y = 0 - roids[i].r;
    };
  };
};
