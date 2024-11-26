const canvStat = document.getElementById("gameStatic");
const canvDyn = document.getElementById("gameDynamic");
const ctxS = canvStat.getContext("2d");
const ctxD = canvDyn.getContext("2d");
const texture = document.getElementById("textureSheet");
const dimension = [window.innerWidth, window.innerHeight];
canvStat.width = dimension[0];
canvStat.height = dimension[1];
canvDyn.width = dimension[0];
canvDyn.height = dimension[1];
//ctxS.translate(dimension[0] / 2, dimension[1] / 2);
//ctxD.translate(dimension[0] / 2, dimension[1] / 2);

// 0 = index + 1 = texture column + 2 = texture row
// 3 = title + 4 = description
// 5 = base cost + 6 = cost factor
// 7 = max level, 8 = one time purchase = false
// 9 = requirement = -1

const MONEY_PER_CLICK = [0, 0, 2,
  "Quality Baking", "Increase the base money earned for each tap.",
  30, 0.08,
  999, false,
  -1];
const COOKIE_EXPLODE = [1, 1, 2,
  "Cookie Explosion", "The cookie will explode at a certain size for bonus money.",
  150, 0,
  1, true,
  -1];
const EXPLODE_QUICKER = [2, 3, 2,
  "Explosive Taps", "The cookie will increase in size faster.",
  200, 0.2,
  15, false,
  COOKIE_EXPLODE[0]];
const EXPLODE_BONUS = [3, 2, 2,
  "Better Explosions", "Increase bonus money when the cookie explodes.",
  200, 0.09,
  999,
  false,
  COOKIE_EXPLODE[0]];
const PULSE_SLOW = [4, 3, 2,
  "Stronger Ingredients", "The cookie will shrink at a slower pace.",
  4000, 0.07,
  50, false,
  -1];
const PULSE_LIMIT = [5, 3, 2,
 "Early Explosions", "Reduce the size required before the cookie explodes.",
 5000, 0.09,
 50, false,
 -1];
const ADD_CONTAINER = [6, 0, 4,
"Purchase Container", "Purchase a container to fill and sell for more profit streams.",
1500, 0.2,
5, false,
-1];
const AUTOCLICKERS = [7, 8, 2,
 "Automation", "The cookie will be auto tapped periodically.",
 8500, 0.03,
 60, false,
 -1];
const IDLE_EARNING = [8, 5, 4,
"Passive Income", "Earn money even while away.",
15000, 0,
1, true,
AUTOCLICKERS[0]];
const ROLLING_MULTIPLIER = [9, 4, 2,
  "Quick Tap Bonus", "A stacking bonus for quick taps, increasing all profits for a short duration.",
  10000, 0,
  1, true,
  -1];
const ROLLING_DURATION = [10, 5, 2,
  "Longer Bonus", "Increase the time before the stacking bonus expires.",
  8000, 0.03,
  99, false,
  ROLLING_MULTIPLIER[0]];
const ROLLING_BONUS = [11, 6, 2,
  "Higher Bonus", "Increase max for the stacking bonus.",
  8000, 0.08,
  99,  false,
  ROLLING_MULTIPLIER[0]];
const BONUS_INCREASE = [12, 6, 2,
  "Better Stacking", "Stacking bonus will increase by a larger amount.",
  25500, 0.06,
  50, false,
 ROLLING_MULTIPLIER[0]];
const CONTAINER_FILL = [13, 1, 4,
 "Container Logistics", "Each tap will fill more containers.",
 25000, 0.15,
 4, false,
ADD_CONTAINER[0]];
const EXPLOSION_FILL = [14, 2, 4,
"Expert Filling", "Cookie explosions will now fill your containers.",
100000000, 0,
1, true,
ADD_CONTAINER[0]];
const OVERALL_MULTIPLIER = [15, 7, 2,
  "Better Logistics", "An overall multiplier, increasing all profits by a small margin.",
  10000, 0.1,
  999, false,
  -1];
const MULTIPLIER_BONUS = [16, 7, 2,
"Logistics Overhaul", "Each multiplier increases profits by a larger amount.",
30000, 0.1,
99, false,
OVERALL_MULTIPLIER[0]];
const GOLDEN_COOKIE = [17, 9, 2,
  "The Golden Cookie", "Unlock rare golden cookies that travel across the screen, tap for bonus to all earnings for a short time.",
  5000000, 0,
  1, true,
  -1];
const GOLDEN_COOKIE_TIME = [18, 9, 2,
  "Golden Duration", "Increase the time your golden bonus lasts.",
  500000, 0.05,
  10, false,
GOLDEN_COOKIE[0]];
const GOLDEN_COOKIE_SPEED = [19, 9, 2,
"Faster Reflexes", "Golden cookies will move slower across the screen.",
500000, 0.075,
15, false,
GOLDEN_COOKIE[0]];
const GOLDEN_COOKIE_CHANCE = [20, 9, 2,
"Better Luck", "Slighty increase the chance a golden cookie will appear.",
500000, 0.15,
10, false,
GOLDEN_COOKIE[0]];
const EXPLODE_FRENZY = [21, 15, 2,
  "Cookie Frenzy", "Unlock the cookie frenzy bonus, explosions are more profitable for a short duration. Tap the cookie to increase the duration.",
  5000000, 0,
  1, true,
  -1];
const FRENZY_TIME = [22, 15, 2,
"Sugar Rush", "Increase the time cookie frenzy lasts.",
5000000, 0.05,
25, false,
EXPLODE_FRENZY[0]];
const FRENZY_COOLDOWN = [23, 15, 2,
"Sugar Cravings", "Reduce the cooldown on your cookie frenzy.",
5000000, 0.1,
5, false,
EXPLODE_FRENZY[0]];
// 0 = index + 1 = texture column + 2 = texture row
// 3 = title + 4 = description
// 5 = base cost + 6 = cost factor
// 7 = max level, 8 = one time purchase = false
// 9 = requirement = -1
const NUMBER_OF_UPGRADES = 24; // total shop upgrades

const CONTAINER_LEVEL = [0, 10, 2,
  "Level", 1630.714, 0.3,
  4, false];
const CONTAINER_SIZE = [1, 11, 2,
  "Capacity", 8000, 0.05,
  50, false];
const CONTAINER_PRICE = [2, 12, 2,
  "Price", 5000, 0.075,
  999, false];
const CONTAINER_AUTOCLICK = [3, 13, 2,
  "Auto Fill", 10000, 0,
  1, true];
const CONTAINER_AUTOSELL = [4, 14, 2,
  "Auto Sell", 15000, 0,
  1, true];
 // 0 = index + 1 = texture column + 2 = texture row
 // 3 + title + 4 = base cost + 5 = cost factor
 // 6 = max level + 7 = one time purchase

const HOLD_TO_TAP = [0, 0, 8,
"Hold to Tap", "You can now hold to tap the cookie. Additional points will increase the speed of the tap.",
99];
const DOUBLE_PRESTIGE_BONUS = [1, 0, 8,
"Double Prestige Bonus", "Double the bonus of each point of prestige. Additional points will double the bonus further.",
99];
const DOUBLE_PRESTIGE_FOR = [2, 0, 8,
"Double Prestige", "Double the amount of prestige you will receive next prestige. Additional points will double the amount further.",
99];
const FASTER_AUTOCLICKERS = [3, 0, 8,
"Faster Auto Clickers", "Increase the speed each auto clicker will tap the cookie. Additional points will increase the speed further.",
99];
const CHEAPER_PRICES = [4, 0, 8,
"Cheaper Prices", "Decrease the price of all upgrades by 10%. Additional points will decrease by a further 10%. Maximum 9 points.",
9];
const INFINITE_BONUS_TIME = [5, 0, 8,
"Infinite Bonus Time", "The stacking bonus will never expire. Stacking bonus will affect the money earned upon returning to the game. Maximum 1 point.",
1];
const EXPLODE_TO_GOLDEN = [6, 0, 8,
"Golden Explodes", "Every 50 cookie explodes will activate a golden cookie. Additional points will reduce the amount of explodes required. Maximum 10 points. Requires the golden cookie upgrade!",
10];
// 0 = index + 1 = texture column + 2 = texture row
// 3 = title + 4 = description
// 5 = max level
const NUMBER_OF_TALENTS = 7; // total talents
const NUMBER_OF_ACHIEVEMENTS = 7; // total achievements

const units = [ // list of money units
  "K",//"Thousand",
  "M",//"Million",
  "B",//"Billion",
  "T",//"Trillion",
  "q",//"Quadrillion",
  "Q",//"Quintillion",
  "s",//"Sextillion",
  "S",//"Septillion",
  "O",//"Octillion",
  "N",//"Nonillion",
  "D",//"Decillion",
  "uD",//"Undecillion",
  "dD",//"Duodecillion",
  "tD",//"Tredecillion",
  "qD",//"Quattuordecillion",
  "QD",//"Quindecillion",
  "sD",//"Sexdecillion",
  "SD",//"Septdecillion",
  "oD",//"Octodecillion",
  "nD",//"Novemdecillion",
  "V",//"Vigintillion",
  "uV",//"Unvigintillion",
  "dV",//"Duovigintillion",
  "tV",//"Trevigintillion",
  "qV",//"Quattuorvigintillion",
  "QV",//"Quinvigintillion",
  "sV",//"Sexvigintillion",
  "SV",//"Septvigintillion",
  "oV",//"Octovigintillion",
  "nV",//"Novemvigintillion",
  "TG",//"Trigintillion"
];
let CONTAINERS = [];
let ACHIEVEMENTS = [];
let ACHIEVEMENTS_PLAYER = [];
let PLAYER_STATS = [];
let lastTime = 0;
let now = new Date();
let time = now.getTime();
let expireTime = time + (365 * 24 * 60 * 60);
let latestTime, then, elapsed, timer, touchEvent, utility, cookie, player;
let order = 0;
let clickEffect = [];
let explodingCookie = [];
let goldCookie = [];
let xDown = null;
let yDown = null;

class Game {
  constructor() {
    this.width = dimension[0];
    this.height = dimension[1];
    if (this.width > this.height) this.minDim = this.height; // relative dimension
    else this.minDim = this.width; // relative dimension
    this.frameW = 120;
    this.frameH = 120;
    this.FPS = 60;
    // 0 = Start, 1 = Cookie, 2 = Shop, 3 = Prestige, 4 = Menu
    this.states = [0, 1, 2, 3, 4];
    this.state = 0;
    if (this.width < this.height) this.textSize = 85;
    else this.textSize = 25;
    this.time = new Date();
  };
  drawBackground() { // draw the background
    ctxS.fillStyle = "hsl(195, 50%, 70%)"; // background
    ctxS.fillRect(0, 0, this.width, this.height); // background
    ctxS.imageSmoothingEnabled = true;
    ctxS.imageSmoothingQuality = "high";
  };
  drawStartScreen() { // game start screen
    game.drawBackground();
    ctxS.drawImage( // the cookie
      texture, // the texture sheet
      0 * game.frameW, 0 * game.frameH, // texture x + y
      game.frameW, game.frameH, // texture width + height
      (game.width / 2) - cookie.r, (game.height / 4) - cookie.r, // destination x + y
      2 * cookie.r, 2 * cookie.r // drawn width + height
    );
    ctxS.fillStyle = "white"; // button color
    ctxS.fillRect(game.width / 4, game.height / 2, game.width / 2, game.textSize * 2); // play button
    ctxS.fillRect(game.width / 4, (game.height / 2) + game.textSize * 2.5, game.width / 2, game.textSize * 2); // exit button
    ctxS.fillStyle = "black"; // game title color
    ctxS.textAlign = "center"; // game title alignment
    ctxS.textBaseline = "middle"; // game title alignment
    ctxS.font = "small-caps bolder " + 2 * this.textSize + "px calibri"; // game title
    ctxS.fillText("Cookie", game.width / 2, game.height / 4.5); // game title
    ctxS.fillText("Frenzy", game.width / 2, game.height / 3.5); // game title
    ctxS.font = this.textSize + "px calibri";
    ctxS.fillText("Play", game.width / 2, (game.height / 2) + game.textSize);
    ctxS.fillText("Exit", game.width / 2, (game.height / 2) + (3.5 * game.textSize));
  };
  drawMenu() { // draw the top menu bar
    if (game.state > 0) { // if not on start screen
      // money area
      ctxD.fillStyle = "white";
      ctxD.fillRect(0, 0, this.width, 2 * this.textSize);
      ctxD.fillStyle = "lightgrey";
      ctxD.fillRect(0, this.textSize, this.width, 1 * this.textSize);
      ctxD.fillStyle = "black";
      ctxD.textAlign = "center";
      ctxD.textBaseline = "middle";
      ctxD.font = this.textSize / 1.5 + "px calibri";
      ctxD.globalAlpha = 0.5;
      ctxD.fillText("Admin", this.width / 6, 1.5 * this.textSize);
      ctxD.fillText("Stock", this.width / 2, 1.5 * this.textSize);
      ctxD.fillText("R & D", (5 * this.width) / 6, 1.5 * this.textSize);
      ctxD.globalAlpha = 1;
      if (game.state == 2) { // shop screen
        ctxD.fillText("Stock", this.width / 2, 1.5 * this.textSize);
      };
      if (game.state == 3) { // prestige screen
        ctxD.fillText("R & D", (5 * this.width) / 6, 1.5 * this.textSize);
      };
      if (game.state == 4) { // menu screen
        ctxD.fillText("Admin", this.width / 6, 1.5 * this.textSize);
      };
      ctxD.textAlign = "left";
      ctxD.textBaseline = "top";
      ctxD.font = game.textSize + "px calibri";
      ctxD.fillText("$" + utility.convert(player.money), 5, 5); // draw money
      ctxD.font = game.textSize / 2 + "px calibri";
      ctxD.textAlign = "right";
      ctxD.fillText("$" + player.EPS + "/s", game.width - 10, 0.25*game.textSize); // draw the money per second

      // for (let i = 0; i < clickEffect.length; i++) { // draw the earned money
      //   ctxD.textAlign = "center";
      //   ctxD.textBaseline = "middle";
      //   ctxD.strokeStyle = "black";
      //   ctxD.lineWidth = "1";
      //   if (clickEffect[i].x < game.width * 1.5) {
      //     ctxD.font = clickEffect[i].font + "px calibri";
      //     ctxD.globalAlpha = 1 - (clickEffect[i].x / (game.width * 1.5));
      //     ctxD.fillStyle = clickEffect[i].color;
      //     if (clickEffect[i].type) { // show earn money or lose money
      //       ctxD.fillText("+$" + clickEffect[i].text, clickEffect[i].x, clickEffect[i].y);
      //       ctxD.strokeText("+$" + clickEffect[i].text, clickEffect[i].x, clickEffect[i].y);
      //     } else {
      //       ctxD.fillText("-$" + clickEffect[i].text, clickEffect[i].x, clickEffect[i].y);
      //       ctxD.strokeText("-$" + clickEffect[i].text, clickEffect[i].x, clickEffect[i].y);
      //     };
      //     clickEffect[i].x += clickEffect[i].speed;
      //   } else {
      //     clickEffect[0] = null;
      //     clickEffect.splice(0, 1);
      //   };
      // };
      ctxD.globalAlpha = 1;
    };
  };
  start() {
    utility = new Utility;
    cookie = new Cookie;
    player = new Player;
    utility.setUgrades();
    cookie.setUgrades();
    game.update();
  };
  update() {
    utility.update();
    cookie.update();
    for (let i = 0; i < explodingCookie.length; i++) {
      if (explodingCookie[i].x + explodingCookie[i].xV < -explodingCookie[i].r || explodingCookie[i].x + explodingCookie[i].xV > game.width + explodingCookie[i].r || explodingCookie[i].y + explodingCookie[i].yV < -explodingCookie[i].r || explodingCookie[i].y + explodingCookie[i].yV > game.height + explodingCookie[i].r) {
        explodingCookie[i] = null;
        explodingCookie.splice(i,1);
      };
    };
    if (player.level[ADD_CONTAINER[0]] > 0) {
      for (let i = 0; i < CONTAINERS.length; i++) {
        CONTAINERS[i].update();
      };
    };
    if (player.level[IDLE_EARNING[0]] > 0 && utility.deltaTime(player.latestTime)  > (60000)) { // no activity for 1 minute+
      player.returning = true;
    } else {
      player.returning = false;
    };
    player.update();
  };
  loop(now) {
    now = Date.now();
    elapsed = now - then;
    if (elapsed > 1000 / game.FPS) { // throttle based on FPS
      then = now - (elapsed % (1000 / game.FPS));
      ctxS.clearRect(0, 0, game.width, game.height);
      ctxD.clearRect(0, 0, game.width, game.height);
      // console.log(game.rotation);
      // ctxD.rotate(game.rotation);
      if (game.state > 0) game.update(); // update the game parameters
      if (game.state == 0) { // draw the start menu
        game.drawStartScreen();
      } else if (game.state == 1) { // draw the cookie screen
        game.drawBackground();
        utility.drawCookieScreen();
      } else if (game.state == 2) { // draw the shop screen
        game.drawBackground();
        utility.drawShop();
      } else if (game.state == 3) { // draw the prestige screen
        game.drawBackground();
        utility.drawPrestigeScreen();
      } else { // draw the menu screen
        game.drawBackground();
        utility.drawMenuScreen();
      };
      if (player.returning && game.state > 0) { // display when player returns
        player.returns();
      };
      game.drawMenu();
      if (!player.returning && (!lastTime || now - lastTime >= utility.tapRate)) { // auto click occasionally
        lastTime = now;
        cookie.click(false);
        for (let i = 0; i < utility.activeContainers; i++) {
          if (CONTAINERS[i].autoFilling > 0) {
            CONTAINERS[i].fill();
          };
        };
      };
      if (player.level[GOLDEN_COOKIE[0]] > 0 && Math.random() > cookie.goldChance) {
        goldCookie.push(new GoldCookie());
      };
    };
    if (game.state == 2) input.lastdY = input.dY;
    latestTime = Date.now();
    requestAnimationFrame(game.loop);
  };
};

class InputHandler {
  constructor() {
    this.dY = 0;
    this.dX = 0;
    this.lastClick = 0;
    this.lastdY = 0;
    this.dYSmoothing = 0;
    this.tap = false;
    this.holding = [];
    document.addEventListener("click", (e) => {
      this.click(e.x, e.y);
    });
    document.addEventListener("touchstart", (e) => {
      this.touchstart(e);
    });
    document.addEventListener("touchmove", (e) => {
      this.touchmove(e);
    });
    document.addEventListener("touchend", (e) => {
      if (timer) {
        clearInterval(timer);
        timer = null;
        touchEvent = null;
      };
    });
    window.addEventListener("wheel", (e) => {
      this.scroll(e);
    });
  };
  click (x, y) {
    if (game.state == 0) { // game start screen
      if (x > (game.width / 4) && x < 3 * (game.width / 4)) {
        if (y > (game.height / 2) && y < (game.height / 2) + (2 * game.textSize)) {
          game.state = 1;
          return;
        };
        if (y > (game.height / 2) + (2.5 * game.textSize) && y < (game.height / 2) + (4.5 * game.textSize)) {
          window.history.go(-1);
        };
      };
    }
    else { // player is actively playing
      player.latestTime = latestTime;
      if (player.returning) {
        player.returning = false;
        player.money += player.returnWorth;
        player.earned += player.returnWorth;
        clickEffect.push(new Effects(utility.convert(player.returnWorth), true, "green", 1.5));
      };
    };
    if (game.state == 1) { // player cookie screen
      if (this.tap == false) { // if player didnt tap the screeen
        if (Math.pow(x - cookie.x, 2) + Math.pow(y - cookie.y, 2) < Math.pow(cookie.r + cookie.pulseCount, 2)) { // check if in the cookie
          cookie.click();
        };
        for (let i = 0; i < goldCookie.length; i++) {
          if (x > goldCookie[i].x && x < goldCookie[i].x + goldCookie[i].size && y > goldCookie[i].y && y < goldCookie[i].y + goldCookie[i].size) {
            goldCookie[i].click(i);
          };
        };
        for (let i = 0; i < CONTAINERS.length; i++) {
          if (y > CONTAINERS[i].y && y < CONTAINERS[i].y + CONTAINERS[i].length && x > CONTAINERS[i].x && x < CONTAINERS[i].x + CONTAINERS[i].length) { //check if container is tapped
            CONTAINERS[i].sell();
          };
        };
      };
      if (y > utility.frenzyY && y < (utility.frenzyY + game.textSize) && x > utility.frenzyX && x < (utility.frenzyX + utility.frenzyLength)) {
        if (utility.canFrenzy) {
          utility.frenzyLeft = Date.now();
          utility.inFrenzy = true;
          utility.canFrenzy = false;
          utility.frenzyStart = Date.now();
          player.frenzyActivated++;
        };
      };
      if (ADD_CONTAINER[0] > 0) { // upgrade containers button is on screen
        if (y > utility.containerTableY + game.textSize && y < utility.containerTableY + (2 * game.textSize)) { // tapped on upgrade containers
          if (!utility.containerUpgrading) { // container upgrades active
            utility.containerTableY -= game.height / 4;
            utility.containerUpgrading = true;
          } else { // close the container upgrade screen
            utility.containerTableY += game.height / 4;
            utility.containerUpgrading = false;
            utility.containerFocused = null;
            for (let i = 0; i < CONTAINERS.length; i++) { // turn off each focus button
              CONTAINERS[i].focused = false;
            };
          };
        };
        if (y > CONTAINERS[0].focusY && y < CONTAINERS[0].focusY + CONTAINERS[0].focusLength) { // tapped in container focus area
          for (let i = 0; i < CONTAINERS.length; i++) { // check each focus button
            if (x > CONTAINERS[i].focusX && x < CONTAINERS[i].focusX + CONTAINERS[i].focusLength) { // check x for each focus button
              if (!CONTAINERS[i].active) return; // container not active
              for (let j = 0; j < CONTAINERS.length; j++) { // turn off each focus except tapped
                if (j == i) { // player tapped focus button
                  if (CONTAINERS[j].focused) { // turn off already focused
                    CONTAINERS[j].focused = false;
                    utility.containerFocused = null;
                  } else { // make container focused
                    CONTAINERS[j].focused = true;
                    utility.containerFocused = i;
                  };
                } else CONTAINERS[j].focused = false;
              };
            };
          };
        };
        if (utility.containerFocused != null) { // a container is focused
          if (y > game.height - (1.1 * game.frameH) && y < game.height - (0.1 * game.frameH)) {
            let cntr = CONTAINERS[utility.containerFocused];
            // upgrades: 0 - level, 2 - capacity, 3 - price, 4 - auto fill, 5 - auto sell
            if (x > utility.cUpgrade1X && x < utility.cUpgrade1X + game.frameW) { // level btn
              cntr.upgrade(0, cntr.levelPrice);
            };
            if (x > utility.cUpgrade2X && x < utility.cUpgrade2X + game.frameW) { // capacity btn
              cntr.upgrade(2, cntr.sizePrice);
            };
            if (x > utility.cUpgrade3X && x < utility.cUpgrade3X + game.frameW) { // price btn
              cntr.upgrade(3, cntr.pricePrice);
            };
            if (x > utility.cUpgrade4X && x < utility.cUpgrade4X + game.frameW) { // auto fill btn
              cntr.upgrade(4, cntr.autoFillingPrice);
            };
            if (x > utility.cUpgrade5X && x < utility.cUpgrade5X + game.frameW) { // auto sell btn
              cntr.upgrade(5, cntr.autoSellingPrice);
            };
          };
        };
      };
    };
    if (game.state == 2) { // shop screen
      if (x > SHOP_BUTTONS[0].length - SHOP_BUTTONS[0].size && x < SHOP_BUTTONS[0].length && y > 2.5 * game.textSize) { // check if in upgrade button area
        for (let i = 0; i < NUMBER_OF_UPGRADES; i++) { // check each button
          if (y > SHOP_BUTTONS[i].y - input.dY && y < SHOP_BUTTONS[i].y + SHOP_BUTTONS[i].size - input.dY) {
            utility.upgrade(i);
            break;
          };
        };
      };
    };
    if (game.state == 3) { // prestige screen
      if (!utility.prestigeConfirm && x > utility.prestigeButtonX && x < (utility.prestigeButtonX + utility.prestigeButtonWidth) && y > utility.prestigeButtonY && y < utility.prestigeButtonY + utility.prestigeButtonHeight) { // click on prestige button
        utility.prestigeScreen = true;
      };
      if (utility.prestigeConfirm && y < game.height / 2.5 || y > (game.height / 2) + (1.5 * game.textSize) || x < game.width / 5 || x > game.width - (game.width / 5)) { // click off the prestige button
        utility.prestigeConfirm = false;
      };
      if (utility.prestigeConfirm && y > game.height / 2 && y < game.height / 1.75) { // prestige confirm buttons
        if (x > game.width / 2 - (2 * game.textSize) && x < game.width / 2 - (game.textSize)) { // confirm
          utility.prestigeConfirm = false;
          utility.prestigeScreen = false;
          player.reset();
        };
        if (x > (game.width / 2) + (game.textSize) && x < (game.width / 2) + (2 * game.textSize)) {
          utility.prestigeConfirm = false;
          utility.prestigeScreen = false;
        };
      };
      if (x > TALENT_BUTTONS[0].plusX && x < TALENT_BUTTONS[0].plusX + TALENT_BUTTONS[0].buttonWidth) { // tapped in plus talent area
        for (let i = 0; i < TALENT_BUTTONS.length; i++) {
          if (y > TALENT_BUTTONS[i].plusY && y < TALENT_BUTTONS[i].plusY + TALENT_BUTTONS[i].buttonHeight) {
            TALENT_BUTTONS[i].changeTalent(true);
          };
        };
      };
      if (x > TALENT_BUTTONS[0].minusX && x < TALENT_BUTTONS[0].minusX + TALENT_BUTTONS[0].buttonWidth) { // tapped in minus talent area
        for (let i = 0; i < TALENT_BUTTONS.length; i++) {
          if (y > TALENT_BUTTONS[i].minusY && y < TALENT_BUTTONS[i].minusY + TALENT_BUTTONS[i].buttonHeight) {
            TALENT_BUTTONS[i].changeTalent(false);
          };
        };
      };
    };
    if (game.state == 4) { // menu screen
      if (y > ((PLAYER_STATS.length + 3.5) * game.textSize - input.dY) && y < (PLAYER_STATS.length + 3.5) * game.textSize - input.dY + game.textSize) { // reset ALL button
        player.reset(true);
      };
    };
    if (y > game.textSize && y < 2 * game.textSize) { // navigation button area
      input.dY = 0;
      if (x > game.width / 3 && x < game.width - (game.width / 3)) { // shop button clicked
        this.dY = this.lastdY;
        if (game.state == 2) game.state = 1;
        else game.state = 2;
      };
      if (x > game.width - (game.width / 3)) { //  prestige button clicked
        if (game.state == 3) game.state = 1;
        else game.state = 3;
      };
      if (x < game.width / 3) { // menu button clicked
        if (game.state == 4) game.state = 1;
        else game.state = 4;
      };
    };
  };
  touchstart (e) {
    if (e.cancelable) e.preventDefault();
    const firstTouch = e.touches[0];
    const ongoingTouches = [];
    this.tap = true;
    xDown = firstTouch.clientX;
    yDown = firstTouch.clientY;
    for (let i = 0; i < e.touches.length; i++) {
      ongoingTouches.push(e.targetTouches[i]);
      if (game.state == 1) { // if on cookie screen
        if ((Math.pow(ongoingTouches[i].clientX - cookie.x, 2) + Math.pow(ongoingTouches[i].clientY - cookie.y, 2)) < Math.pow(cookie.r + cookie.pulseCount, 2)) { // check if in the cookie
          cookie.click();
        };
        for (let j = 0; j < goldCookie.length; j++) {
          if (xDown > goldCookie[j].x && xDown < goldCookie[j].x + goldCookie[j].size && yDown > goldCookie[j].y && yDown < goldCookie[j].y + goldCookie[j].size) {
            goldCookie[j].click(j);
          };
        };
        for (let j = 0; j < CONTAINERS.length; j++) {
          if (ongoingTouches[i].clientY > CONTAINERS[j].y && ongoingTouches[i].clientY < CONTAINERS[j].y + CONTAINERS[j].length && ongoingTouches[i].clientX > CONTAINERS[j].x && ongoingTouches[i].clientX < CONTAINERS[j].x + CONTAINERS[j].length) { //check if container is tapped
            CONTAINERS[j].sell();
          };
        };
      };
    };
    if (!timer) {
      timer = setInterval(this.longTouch, utility.holdToTapRate);
      touchEvent = e;
    };
  };
  touchmove (e) {
    e.preventDefault();
    // set up touch variables
    if (!xDown || !yDown) {
      return;
    };
    var xUp = e.touches[0].clientX;
    var yUp = e.touches[0].clientY;
    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;
    // determine the direction of swipe
    if (Math.abs(xDiff) > Math.abs(yDiff)) {
      if (xDiff > 0) {} // left swipe
      else {}; // right swipe
      return;
    } else {
      if (yDiff > 0) { // up swipe
        this.dYSmoothing = yDiff / 25;
      } else { // down swipe
        this.dYSmoothing = yDiff / 25;
      };
    };
    //yDown = yUp;
  };
  scroll (e) {
    input.dY += e.deltaY;
  };
  longTouch() {
    if (player.talent[HOLD_TO_TAP[0]] > 0) {
      input.touchstart(touchEvent);
    };
    //input.click(touchEvent.touches[0].clientX, touchEvent.touches[0].clientY);
  };
};

class Player {
  constructor() {
    this.initPlayer();
    this.earnedThen = this.earned; // previous earned
    this.earnedNow = 0; // earning now
    this.EPS = 0; // player earning per second
    setInterval(this.calcEarning.bind(this), 2000);
  };
  returns() {
    player.lastPlaySeconds = utility.deltaTime(player.latestTime) / 1000;
    player.lastPlayHours = player.lastPlaySeconds / 3600;
    player.lastPlayHoursRemainder = player.lastPlaySeconds % 3600;
    player.lastPlayMinutes = player.lastPlayHoursRemainder / 60;
    player.lastPlayMinutesRemainder = player.lastPlayHoursRemainder % 60;
    player.lastPlayTime = Math.floor(player.lastPlayHours) + "h " + Math.floor(player.lastPlayMinutes) + "m " + Math.floor(player.lastPlayMinutesRemainder) + "s";
    player.returnWorth = utility.multiply(cookie.worth * (player.lastPlaySeconds / (utility.tapRate / 1000)));
    ctxD.fillStyle = "black";
    ctxD.globalAlpha = "0.8";
    ctxD.fillRect(0, 0, game.width, game.height);
    ctxD.fillStyle = "white";
    ctxD.globalAlpha = "1";
    ctxD.fillRect((game.width / 2) - (game.width / 3), (game.height / 2) - (game.height / 4), game.width / 1.5, game.height / 2);
    ctxD.fillStyle = "black";
    ctxD.textAlign = "center";
    ctxD.textBaseline = "top";
    ctxD.font = game.textSize + "px calibri";
    ctxD.fillText("Welcome Back!", (game.width / 2), (game.height / 3.5));
    ctxD.fillText("It's been:", (game.width / 2), (game.height / 3.5) + (2 * game.textSize));
    ctxD.fillText(player.lastPlayTime, game.width / 2, (game.height / 3.5) + (3 * game.textSize));
    ctxD.font = (game.textSize / 0.7) + "px calibri";
    ctxD.fillText("Earning", game.width / 2, game.height / 2);
    ctxD.font = game.textSize + "px calibri";
    ctxD.fillText("$" + utility.convert(player.returnWorth), game.width / 2, (game.height / 2) + (2 * game.textSize));
    ctxD.font = game.textSize / 2 + "px calibri";
    ctxD.fillText("Tap to Continue", game.width / 2, (2.8 * game.height) / 4);
  };
  calcEarning() {
    this.earnedNow = player.earned; // get how much player has earned
    // get the difference between earned now and earned then over time
    this.EPS = utility.convert((this.earnedNow - this.earnedThen) / 2);
    this.earnedThen = this.earnedNow;
    if (player.bestEPS < player.EPS) player.bestEPS = player.EPS;
  };
  updateStats() {
    PLAYER_STATS = [
      "Player Achievements",
      " ",
      "Reach a cookie worth of $1M: " + utility.convert(utility.multiply(cookie.worth)) + "/" + utility.convert(this.cookieWorthAchieve),
      "Have 60 auto clickers at once: " + this.bestAutoclickers + "/" + this.autoClickerAchieve,
      "Reach a stacking bonus of x100: " + this.bestStackingBonus + "/" + this.stackingBonusAchieve,
      "Longest stacking bonus of 15 mins: " + utility.round(this.longestStackingBonus) + "/" + this.stackingBonusTimeAchieve,
      "Earn $1D in one prestige: " + utility.convert(this.bestEarnings) + "/" + utility.convert(this.earningsAchieve),
      "Longest cookie frenzy of 5 mins: " + this.longestFrenzy + "/" + this.frenzyTimeAchieve,
      "Spend $1Q in one purchase: " + utility.convert(this.highestMoneySpent) + "/" + utility.convert(this.spendAchieve),
      " ",
      "Player Statistics",
      " ",
      "Cookie Worth: $" + utility.convert(utility.multiply(cookie.worth)),
      "Cookie Explode Bonus: $" + utility.convert(utility.multiply(cookie.bonusWorth)),
      "Average Container Worth: $" + utility.convert(utility.multiply(utility.containerAverage())),
      "Highest Container Worth: $" + utility.convert(utility.highestContainerWorth),
      "Current Multiplier: x" + utility.convert(utility.multiply(1)),
      "Current Prestige Earnings: $" + utility.convert(player.earned),
      "Prestige: " + utility.convert(player.prestige),
      "Total Prestiges: " + utility.convert(player.timesPrestiged),
      "Most Expensive Purchase: $" + utility.convert(player.highestMoneySpent),
      "Total Money Spent: $" + utility.convert(player.moneySpent),
      "Total Earnings: $" + utility.convert(player.totalEarnings),
      "Highest Earnings Per Second: $" + utility.convert(player.bestEPS),
      "Cookies Clicked: " + utility.convert(player.cookieClicked),
      "Cookies Exploded: " + utility.convert(player.cookieExploded),
      "Containers sold: " + utility.convert(player.containersSold),
      "Golden Cookies Clicked: " + utility.convert(player.goldCookieClicked),
      "Upgrades Purchased: " + utility.convert(player.upgradesPurchased),
      "Most Expensive Container Sold: $" + utility.convert(player.highestContainer),
      "Most Auto Clickers: " + player.bestAutoclickers,
      "Highest Stacking Bonus: x" + player.bestStackingBonus,
      "Longest Stacking Bonus: " + utility.round(player.longestStackingBonus) + " seconds",
      "Times Activated Frenzy: " + player.frenzyActivated,
      "Longest Frenzy: " + utility.round(player.longestFrenzy) + " seconds",
      " ",
      "Units Information",
      " ",
      "Thousand= " + units[0] + ", Million= " + units[1],
      "Billion= " + units[2] + ", Trillion= " + units[3],
      "Quadrillion= " + units[4] + ", Quintillion= " + units[5],
      "Sextillion= " + units[6] + ", Septillion= " + units[7],
      "Octillion= " + units[8] + ", Nonillion= " + units[9],
      "Decillion= " + units[10] + ", Undecillion= " + units[11],
      "Duodecillion= " + units[12] + ", Tredecillion= " + units[13],
      "Quattuordecillion= " + units[14] + ", Quindecillion= " + units[15],
      "Sexdecillion= " + units[16] + ", Septdecillion= " + units[17],
      "Octodecillion= " + units[18] + ", Novemdecillion= " + units[19],
      "Vigintillion= " + units[20] + ", Unvigintillion= " + units[21],
      "Duovigintillion= " + units[22] + ", Trevigintillion= " + units[23],
      "Quattuorvigintillion= " + units[24] + ", Quinvigintillion= " + units[25],
      "Sexvigintillion= " + units[26] + ", Septvigintillion= " + units[27],
      "Octovigintillion= " + units[28] + ", Novemvigintillion= " + units[29],
      "Trigintillion= " + units[30]
    ];
  };
  updateAchievements() {
    ACHIEVEMENTS[0] = player.cookieWorthAchieve;
    ACHIEVEMENTS[1] = this.autoClickerAchieve;
    ACHIEVEMENTS[2] = this.stackingBonusAchieve;
    ACHIEVEMENTS[3] = this.stackingBonusTimeAchieve;
    ACHIEVEMENTS[4] = this.earningsAchieve;
    ACHIEVEMENTS[5] = this.frenzyTimeAchieve;
    ACHIEVEMENTS[6] = this.spendAchieve;
    ACHIEVEMENTS_PLAYER[0] = utility.multiply(cookie.worth);
    ACHIEVEMENTS_PLAYER[1] = player.bestAutoclickers;
    ACHIEVEMENTS_PLAYER[2] = player.bestStackingBonus;
    ACHIEVEMENTS_PLAYER[3] = player.longestStackingBonus;
    ACHIEVEMENTS_PLAYER[4] = player.bestEarnings;
    ACHIEVEMENTS_PLAYER[5] = player.longestFrenzy;
    ACHIEVEMENTS_PLAYER[6] = player.highestMoneySpent;
  };
  reset(everything) {
    player.money = 0;
    player.earned = 0;
    cookie.pulse = 0;
    player.earnedThen = 0;
    player.earnedNow = 0;
    cookie.gold = false;
    utility.frenzyFinish = 0;
    player.rollTimeStart = 0;
    this.level = [];
    for (let i = 0; i < NUMBER_OF_UPGRADES; i++) {
      this.level.push(0);
    };
    this.containerArray = [];
    for (let i = 0; i < 30; i++) {
      this.containerArray.push(0);
    };
    for (let i = 0; i < CONTAINERS.length; i++) {
      CONTAINERS[i].filled = 0;
      CONTAINERS[i].filling = 0;
      CONTAINERS[i].setUgrades();
    };
    if (!everything) {
      this.prestige += Math.floor(utility.prestigeFor);
      player.timesPrestiged++;
      game.update();
      player.initPlayer();
      utility.setUgrades();
      game.state = 1;
      return;
    };
    localStorage.setItem("playerMoney", 0);
    localStorage.setItem("playerMoneyEarned", 0);
    localStorage.setItem("playerTotalEarnings", 0);
    localStorage.setItem("playerUpgrades", 0);
    localStorage.setItem("playerLatestTime", 0);
    localStorage.setItem("playerPrestige", 0);
    localStorage.setItem("playerCookieClicked", 0);
    localStorage.setItem("playerCookieExploded", 0);
    localStorage.setItem("playerContainersSold", 0);
    localStorage.setItem("playerGoldCookieClicked", 0);
    localStorage.setItem("playerUpgradesPurchased", 0);
    localStorage.setItem("playerSpent", 0);
    localStorage.setItem("playerPrestiges", 0);
    localStorage.setItem("playerBestEPS", 0);
    localStorage.setItem("playerFrenzyFinishedTime", 0);
    localStorage.setItem("playerHighestContainer", 0);
    localStorage.setItem("playerBestAutoclickers", 0);
    localStorage.setItem("playerBestStackingBonus", 0);
    localStorage.setItem("playerLongestStackingBonus", 0);
    localStorage.setItem("playerFrenzyActivated", 0);
    localStorage.setItem("playerLongestFrenzy", 0);
    localStorage.setItem("playerContainers", 0);
    localStorage.setItem("playerHighestSpent", 0);
    localStorage.setItem("playerBestEarnings", 0);
    localStorage.setItem("playerTalents", 0);
    localStorage.setItem("playerSecretIngredients", 0);
    localStorage.setItem("playerAchievements", 0);
    game.start();
    game.state = 0;
  };
  initPlayer() {
    this.money = utility.parseFromLocalStorage("playerMoney",0);
    this.earned = utility.parseFromLocalStorage("playerMoneyEarned",0);
    this.totalEarnings = utility.parseFromLocalStorage("playerTotalEarnings", 0);
    this.level = [];
    this.cost = [];
    this.getLevel = localStorage.getItem("playerUpgrades");
    if (this.getLevel != null) { // the player has a previous save
      this.getLevel = localStorage.getItem("playerUpgrades").split(",");
      for (let i = 0; i < NUMBER_OF_UPGRADES; i++) {
        let temp = parseInt(this.getLevel[i]);
        if (!Number.isInteger(temp)) { // if storage doesnt contain enough upgrades
          temp = 0;
        };
        this.level.push(temp);
      };
    } else { // the player doesnt have a previous save
      for (let i = 0; i < NUMBER_OF_UPGRADES; i++) {
        this.level.push(0);
      };
    };
    SHOP_BUTTONS.forEach((item) => {
      this.cost[item.index] = utility.setPrice(item.baseCost, this.level[item.index], item.costFactor);
      //this.cost[item.index] = 1; // testing purposes
    });
    this.containerArray = [];
    this.getContainerArray = localStorage.getItem("playerContainers");
    if (this.getContainerArray != null) {
      this.getContainerArray = localStorage.getItem("playerContainers").split(",");
      for (let i = 0; i < 30; i++) {
        let temp = parseInt(this.getContainerArray[i]);
        if (!Number.isInteger(temp)) { // if storage doesnt contain enough upgrades
          temp = 0;
        };
        this.containerArray.push(temp);
      };
    } else {
      for (let i = 0; i < (7 * 5); i++) {
        this.containerArray.push(0);
      };
    };
    this.talent = [];
    this.getTalent = localStorage.getItem("playerTalents");
    if (this.getTalent != null) {
      this.getTalent = localStorage.getItem("playerTalents").split(",");
      for (let i = 0; i < NUMBER_OF_TALENTS; i++) {
        let temp = parseInt(this.getTalent[i]);
        if (!Number.isInteger(temp)) { // if storage doesnt contain enough upgrades
          temp = 0;
        };
        this.talent.push(temp);
      };
    } else {
      for (let i = 0; i < NUMBER_OF_TALENTS; i++) {
        this.talent.push(0);
      };
    };
    this.achievementsEarned = [];
    this.getAchievements = localStorage.getItem("playerAchievements");
    if (this.getAchievements != null) {
      this.getAchievements = localStorage.getItem("playerAchievements").split(",");
      for (let i = 0; i < NUMBER_OF_ACHIEVEMENTS; i++) {
        let temp = parseInt(this.getAchievements[i]);
        if (!Number.isInteger(temp)) { // if storage doesnt contain enough upgrades
          temp = 0;
        };
        this.achievementsEarned.push(temp);
      };
    } else {
      for (let i = 0; i < NUMBER_OF_ACHIEVEMENTS; i++) {
        this.achievementsEarned.push(0);
      };
    };
    this.latestTime = utility.parseFromLocalStorage("playerLatestTime", game.time);
    this.prestige = utility.parseFromLocalStorage("playerPrestige",0);
    this.cookieClicked = utility.parseFromLocalStorage("playerCookieClicked", 0);
    this.cookieExploded = utility.parseFromLocalStorage("playerCookieExploded", 0);
    this.containersSold = utility.parseFromLocalStorage("playerContainersSold", 0);
    this.goldCookieClicked = utility.parseFromLocalStorage("playerGoldCookieClicked", 0);
    this.upgradesPurchased = utility.parseFromLocalStorage("playerUpgradesPurchased", 0);
    this.moneySpent = utility.parseFromLocalStorage("playerSpent", 0);
    this.highestMoneySpent = utility.parseFromLocalStorage("playerHighestSpent", 0);
    this.timesPrestiged = utility.parseFromLocalStorage("playerPrestiges", 0);
    this.bestEPS = utility.parseFromLocalStorage("playerBestEPS", 0);
    this.highestContainer = utility.parseFromLocalStorage("playerHighestContainer", 0);
    this.bestAutoclickers = utility.parseFromLocalStorage("playerBestAutoclickers", 0);
    this.rollTimeStart = utility.parseFromLocalStorage("playerRollTimeStart", 0);
    this.stackingBonus = utility.parseFromLocalStorage("playerStackingBonus", 1);
    this.bestStackingBonus = utility.parseFromLocalStorage("playerBestStackingBonus", 0);
    this.longestStackingBonus = utility.parseFromLocalStorage("playerLongestStackingBonus", 0);
    this.frenzyActivated = utility.parseFromLocalStorage("playerFrenzyActivated", 0);
    this.longestFrenzy = utility.parseFromLocalStorage("playerLongestFrenzy", 0);
    this.bestEarnings = utility.parseFromLocalStorage("playerBestEarnings", 0);
    this.secretIngredients = utility.parseFromLocalStorage("playerSecretIngredients", 0);
    this.cookieWorthAchieve = 1000000;
    this.autoClickerAchieve = 60;
    this.stackingBonusAchieve = 100;
    this.stackingBonusTimeAchieve = 900;
    this.earningsAchieve = 1e33;
    this.frenzyTimeAchieve = 300;
    this.spendAchieve = 1e18;
  };
  update(now) { // set up a save function
    localStorage.setItem("playerMoney", player.money);
    localStorage.setItem("playerMoneyEarned", player.earned);
    localStorage.setItem("playerTotalEarnings", player.totalEarnings);
    localStorage.setItem("playerUpgrades", player.level);
    localStorage.setItem("playerContainers", player.containerArray);
    localStorage.setItem("playerLatestTime", latestTime);
    localStorage.setItem("playerPrestige", player.prestige);
    localStorage.setItem("playerCookieClicked", player.cookieClicked);
    localStorage.setItem("playerCookieExploded", player.cookieExploded);
    localStorage.setItem("playerContainersSold", player.containersSold);
    localStorage.setItem("playerGoldCookieClicked", player.goldCookieClicked);
    localStorage.setItem("playerUpgradesPurchased", player.upgradesPurchased);
    localStorage.setItem("playerSpent", player.moneySpent);
    localStorage.setItem("playerHighestSpent", player.highestMoneySpent);
    localStorage.setItem("playerPrestiges", player.timesPrestiged);
    localStorage.setItem("playerBestEPS", player.bestEPS);
    localStorage.setItem("playerFrenzyFinishedTime", utility.frenzyFinish);
    localStorage.setItem("playerHighestContainer", player.highestContainer);
    localStorage.setItem("playerBestAutoclickers", player.bestAutoclickers);
    localStorage.setItem("playerRollTimeStart", player.rollTimeStart);
    localStorage.setItem("playerStackingBonus", utility.round(player.stackingBonus));
    localStorage.setItem("playerBestStackingBonus", player.bestStackingBonus);
    localStorage.setItem("playerLongestStackingBonus", player.longestStackingBonus);
    localStorage.setItem("playerFrenzyActivated", player.frenzyActivated);
    localStorage.setItem("playerLongestFrenzy", player.longestFrenzy);
    localStorage.setItem("playerBestEarnings", player.bestEarnings);
    localStorage.setItem("playerTalents", player.talent);
    localStorage.setItem("playerSecretIngredients", player.secretIngredients);
    localStorage.setItem("playerAchievements", player.achievementsEarned);
  };
};

class Utility {
  constructor() {
    this.checkMark = "\uD83D\uDDF9";
    this.fullCheck = 0;
    this.currentlyFilling = 0;
    this.switch = false;
    this.clickCount = 1; // current click count
    this.clickCountX = 1.25 * game.textSize;
    this.clickCountY = game.textSize * 3.25;
    this.clickCountR = game.textSize;
    this.runningClickCount = 0;
    this.inFrenzy = false;
    this.frenzyX = this.clickCountX + this.clickCountR - 5;
    this.frenzyY = this.clickCountY - (0.5 * this.clickCountR);
    this.frenzyLength = game.width - this.frenzyX - 20;
    this.frenzyLeft = 0;
    this.frenzyStart = 0;
    this.frenzyFinish = this.parseFromLocalStorage("playerFrenzyFinishedTime", 0);
    this.prestigeUpgrade = 0;
    this.prestigeForNext = 0;
    this.prestigeButtonX = 0;
    this.prestigeButtonY = (game.textSize * 2) + 10;
    this.prestigeButtonWidth = game.width;
    this.prestigeButtonHeight = game.height / 4;
    this.highestContainerWorth = 0;
    this.containerTableY = game.height - (1.5 * game.frameH);
    this.containerUpgrading = false;
    this.containerFocused = null;
    this.cUpgrade1X = 0.15 * (game.width / 5);
    this.cUpgrade2X = 1.15 * (game.width / 5);
    this.cUpgrade3X = 2.15 * (game.width / 5);
    this.cUpgrade4X = 3.15 * (game.width / 5);
    this.cUpgrade5X = 4.15 * (game.width / 5);
  };
  parseFromLocalStorage(key, defaultValue) {
    const value = parseFloat(localStorage.getItem(key));
    if (isNaN(value)) return defaultValue;
    else return value;
    //return Number.isInteger(value) ? value : defaultValue;
  }
  drawCookieScreen() { // draw the dynamic cookie screen
    ctxD.textAlign = "center";
    ctxD.fillStyle = "black";
    ctxD.textAlign = "left";
    ctxD.textBaseline = "top";
    ctxD.font = game.textSize + "px calibri";
    for (let i = 0; i < explodingCookie.length; i++) { // draw exploding cookie
      explodingCookie[i].draw(explodingCookie[i].x + (explodingCookie[i].r / 3), explodingCookie[i].xV, explodingCookie[i].y + (explodingCookie[i].r / 3), explodingCookie[i].yV, explodingCookie[i].r / 2, explodingCookie[i].pulseCount, explodingCookie[i].color(), 0);
      // move cookies in random direction
      explodingCookie[i].xV += explodingCookie[i].dX * 30;
      explodingCookie[i].yV += explodingCookie[i].dY * 30;
    };
    cookie.draw(cookie.x, cookie.xV, cookie.y, cookie.yV, cookie.r, cookie.pulseCount, cookie.color(), 0);
    if (this.frenzy) { // draw the frenzy bar
      ctxD.fillStyle = "white";
      if (this.canFrenzy) ctxD.fillStyle = "green";
      ctxD.textBaseline = "top";
      ctxD.textAlign = "center";
      ctxD.font = game.textSize + "px calibri";
      ctxD.fillRect(this.frenzyX, this.frenzyY, this.frenzyLength, this.clickCountR); // base frenzy bar
      ctxD.fillStyle = "red";
      if (utility.inFrenzy) { // time left bar if in frenzy
        ctxD.fillRect(this.frenzyX, this.frenzyY, (1 - (utility.deltaTime(utility.frenzyLeft) / utility.frenzyMax)) * this.frenzyLength, game.textSize);
      };
      if (!utility.inFrenzy && !utility.canFrenzy) {
        ctxD.globalAlpha = 0.5;
        ctxD.fillRect(this.frenzyX, this.frenzyY, (utility.deltaTime(utility.frenzyFinish) / utility.frenzyReset) * this.frenzyLength, game.textSize);
        ctxD.globalAlpha = 1;
      };
      ctxD.fillStyle = "black";
      ctxD.textBaseline = "top";
      ctxD.fillText("Frenzy", game.width / 2, this.frenzyY);
    };
    if (utility.rolling) { // draw the rolling multiplier
      ctxD.fillStyle = "lightgrey";
      ctxD.beginPath();
      ctxD.arc(this.clickCountX, this.clickCountY, this.clickCountR, 0, 2 * Math.PI);
      ctxD.fill();
      if (player.stackingBonus > 1) {
        let g = 255 * (1 - (utility.deltaTime(player.rollTimeStart) / utility.rollTimeMax));
        let r = 255 * (utility.deltaTime(player.rollTimeStart) / utility.rollTimeMax);
        ctxD.fillStyle = "rgb("+r+","+g+",0)";
        ctxD.beginPath();
        ctxD.translate(this.clickCountX, this.clickCountY);
        ctxD.rotate(-(90 * Math.PI) / 180);
        //ctxD.moveTo(1.5 * game.textSize, game.textSize * 4.5);
        ctxD.arc(0, 0, game.textSize, 0, 2 * Math.PI * (utility.deltaTime(player.rollTimeStart) / utility.rollTimeMax), true);
        ctxD.lineTo(0, 0);
        ctxD.closePath();
        ctxD.fill();
        ctxD.rotate((90 * Math.PI) / 180);
        ctxD.translate(-this.clickCountX, -this.clickCountY);
      };
      ctxD.fillStyle = "white";
      ctxD.beginPath();
      ctxD.arc(this.clickCountX, this.clickCountY, this.clickCountR * 0.7, 0, 2 * Math.PI);
      ctxD.fill();
      ctxD.globalAlpha = 1;
      ctxD.fillStyle = "black";
      ctxD.textAlign = "center";
      ctxD.textBaseline = "middle";
      ctxD.font = 0.45 * game.textSize + "px calibri";
      // counter
      ctxD.strokeStyle = "darkergrey";
      ctxD.lineWidth = 2;
      ctxD.strokeText("x" + utility.round(player.stackingBonus), this.clickCountX, this.clickCountY);
      ctxD.fillText("x" + utility.round(player.stackingBonus), this.clickCountX, this.clickCountY);
      ctxD.lineWidth = 1;
    };
    for (let i = 0; i < goldCookie.lenght; i++) { // draw any golden cookie
      goldCookie[i].draw(goldCookie.rX, 0, goldCookie.rY, 0, goldCookie.rR, 0, 3, 0);
      goldCookie[i].goldCount--;
    };
    for (let i = 0; i < goldCookie.length; i++) {
      goldCookie[i].draw();
      goldCookie[i].update(i);
    };
    if (player.level[ADD_CONTAINER[0]] > 0) { //  draw the container table
      ctxD.fillStyle = "white";
      ctxD.fillRect(0, this.containerTableY, game.width, game.height);
      ctxD.fillStyle = "lightgrey";
      ctxD.fillRect(0, this.containerTableY + game.textSize, game.width, game.textSize);
      ctxD.fillStyle = "black";
      ctxD.textAlign = "center";
      ctxD.textBaseline = "top";
      ctxD.font = game.textSize / 1.5 + "px calibri";
      let txt = "";
      if (utility.containerUpgrading) { // container upgrade section
        txt = "Close Container Upgrades";
        ctxD.globalAlpha = 1;
        if (utility.containerFocused == null) { // no container focused
          ctxD.fillText("Select a container to upgrade", 0.5 * game.width, 0.875 * game.height);
        } else { // a container is focused
          ctxD.drawImage(texture, 10 * game.frameW, 2 * game.frameH, game.frameW, game.frameH,
            this.cUpgrade1X, this.containerTableY * 1.25, // destination x + y
            game.frameW, game.frameH);
          ctxD.drawImage(texture, 11 * game.frameW, 2 * game.frameH, game.frameW, game.frameH,
            this.cUpgrade2X, this.containerTableY * 1.25, // destination x + y
            game.frameW, game.frameH);
          ctxD.drawImage(texture, 12 * game.frameW, 2 * game.frameH, game.frameW, game.frameH,
            this.cUpgrade3X, this.containerTableY * 1.25, // destination x + y
            game.frameW, game.frameH);
          ctxD.drawImage(texture, 13 * game.frameW, 2 * game.frameH, game.frameW, game.frameH,
            this.cUpgrade4X, this.containerTableY * 1.25, // destination x + y
            game.frameW, game.frameH);
          ctxD.drawImage(texture, 14 * game.frameW, 2 * game.frameH, game.frameW, game.frameH,
            this.cUpgrade5X, this.containerTableY * 1.25, // destination x + y
            game.frameW, game.frameH);
        };
      } else { // container upgrade button
        txt = "Open Container Upgrades";
        ctxD.globalAlpha = 0.5;
      };
      ctxD.fillText(txt, 0.5 * game.width, this.containerTableY + (1.15 * game.textSize));
      ctxD.globalAlpha = 1;
      for (let i = 0; i < CONTAINERS.length; i++) {
        CONTAINERS[i].draw();
      };
    };
  };
  drawShop() { // draw the dynamic upgrade screen
    for (let i = 0; i < NUMBER_OF_UPGRADES; i++) {
      SHOP_BUTTONS[i].drawButton();
    };
    utility.resetScroll(SHOP_BUTTONS[0].y, SHOP_BUTTONS[NUMBER_OF_UPGRADES - 1].y); // first btn + last btn
  };
  drawPrestigeScreen() { // draw the dynamic prestige / R & D screen
    for (let i = 0; i < TALENT_BUTTONS.length; i++) {
      TALENT_BUTTONS[i].drawTalent();
    };
    ctxD.textAlign = "center";
    ctxD.textBaseline = "middle";
    ctxD.font = game.textSize * 0.85 + "px calibri";
    ctxD.fillStyle = "black";
    ctxD.fillRect(this.prestigeButtonX - 10, this.prestigeButtonY - 10, this.prestigeButtonWidth + 20, this.prestigeButtonHeight + 20); // the prestige button
    ctxD.fillStyle = "white";
    ctxD.fillRect(this.prestigeButtonX, this.prestigeButtonY, this.prestigeButtonWidth, this.prestigeButtonHeight); // the prestige button
    ctxD.fillRect(0, this.prestigeButtonY + this.prestigeButtonHeight + 10, game.width, 1.65 * game.textSize); // the talent point background
    ctxD.fillStyle = "black";
    ctxD.fillText("Current Earnings: " + utility.convert(player.earned), game.width / 2, this.prestigeButtonY + game.textSize);
    ctxD.font = game.textSize * 0.75 + "px calibri";
    ctxD.fillText("You have: " + utility.convert(player.prestige) + " prestige", game.width / 2, this.prestigeButtonY + (2 * game.textSize));
    ctxD.font = game.textSize * 0.5 + "px calibri";
    ctxD.fillText("increasing your earnings by: x" +  utility.convert(utility.prestigeBonus), game.width / 2, this.prestigeButtonY + (2.75 * game.textSize));
    ctxD.fillStyle = "black";
    //ctxD.font  = game.textSize + "px calibri";
    ctxD.fillText("Tap here to collect: " + utility.convert(Math.floor(utility.prestigeFor)) + " prestige", game.width / 2, this.prestigeButtonY + (2.25 * this.prestigeButtonHeight / 3)); // prestige button text
    ctxD.fillRect(8, this.prestigeButtonY + this.prestigeButtonHeight - game.textSize - 2, game.width - 16, (game.textSize / 2) + 4);
    ctxD.fillStyle = "lightgrey";
    ctxD.fillRect(10, this.prestigeButtonY + this.prestigeButtonHeight - game.textSize, game.width - 20, game.textSize / 2);
    ctxD.fillStyle = "green";
    ctxD.fillRect(10, this.prestigeButtonY + this.prestigeButtonHeight - game.textSize, (game.width - 20) * utility.prestigeForNext, game.textSize / 2);
    ctxD.fillStyle = "black";
    ctxD.textAlign = "right";
    ctxD.textBaseline = "top";
    ctxD.font = game.textSize / 1.8 + "px calibri";
    ctxD.fillText("+ ", game.width - 10, this.prestigeButtonY + this.prestigeButtonHeight - game.textSize);
    ctxD.textAlign = "center";
    ctxD.textBaseline = "middle";
    ctxD.font = game.textSize + "px calibri";
    ctxD.fillText("Talent Points: " + player.secretIngredients, game.width / 2, this.prestigeButtonY + this.prestigeButtonHeight + game.textSize);

    if (utility.prestigeConfirm) { // prestige confirm screen
      ctxD.fillStyle = "black";
      ctxD.textAlign = "center";
      ctxD.textBaseline = "middle";
      ctxD.globalAlpha = "0.5";
      ctxD.fillRect(0, 0, game.width, game.height);
      ctxD.globalAlpha = "1";
      ctxD.fillStyle = "white";
      ctxD.fillRect(game.width / 2 - ((game.width / 1.25) / 2), game.height / 2 - ((game.height / 5) / 1.5), game.width / 1.25, game.height / 5);
      ctxD.fillStyle = "green";
      ctxD.fillRect(game.width / 2 - (2 * game.textSize), game.height / 2, game.textSize, game.textSize);
      ctxD.fillStyle = "red";
      ctxD.fillRect(game.width / 2 + (game.textSize), game.height / 2, game.textSize, game.textSize);
      ctxD.fillStyle = "black";
      ctxD.fillText("Are you sure?", game.width / 2, game.height / 2 - (2.15 * game.textSize));
      ctxD.font  = game.textSize / 2 + "px calibri";
      ctxD.fillText("You will lose your current progress", game.width / 2, game.height / 2 - (1.25 * game.textSize));
      ctxD.fillText("and gain " + utility.convert(Math.floor(utility.prestigeFor)) + " prestige.", game.width / 2, game.height / 2 - (0.8 * game.textSize));
      ctxD.fillStyle = "white";
      ctxD.fillText("\u2713", game.width / 2 - (1.5 * game.textSize), game.height / 2 + (0.5 * game.textSize));
      ctxD.fillText("\u2715", game.width / 2 + (1.5 * game.textSize), game.height / 2 + (0.5 * game.textSize));
    };
    utility.resetScroll(TALENT_BUTTONS[0].y, TALENT_BUTTONS[NUMBER_OF_TALENTS - 1].y);
  };
  drawMenuScreen() { // draw the dynamic menu screen
    ctxD.font = game.textSize / 2 + "px calibri";
    ctxD.fillStyle = "red";
    ctxD.fillRect( // reset ALL button
      5, (PLAYER_STATS.length + 3.5) * game.textSize - input.dY,// x + y
      game.width - 10, game.textSize // width + height
    );
    ctxD.fillStyle = "white";
    ctxD.textAlign = "center";
    ctxD.textBaseline = "middle";
    ctxD.fillText("Reset all! WARNING: you will lose everything!", game.width / 2, (PLAYER_STATS.length + 4) * game.textSize - input.dY);
    ctxD.fillStyle = "black";
    ctxD.textBaseline = "top";
    ctxD.textAlign = "left";
    player.updateStats();
    for (let i = 0; i < PLAYER_STATS.length; i++) {
      // if stat should be a heading
      if (i == 0 || i == 10 || i == 36) ctxD.font = "bold " + game.textSize + "px calibri";
      else ctxD.font = game.textSize / 2 + "px calibri";
      ctxD.fillText(PLAYER_STATS[i], 20, (i + 2.5) * game.textSize - input.dY);
    };
    utility.resetScroll(2.5 * game.textSize, (PLAYER_STATS.length + 3.5) * game.textSize);

  };
  setUgrades() {
    this.activeContainers = player.level[ADD_CONTAINER[0]];
    this.clickRounds = player.level[BONUS_INCREASE[0]];
    this.clickIncrease = 0.01;
    this.containerFills = 1 + player.level[CONTAINER_FILL[0]];
    if (player.level[COOKIE_EXPLODE[0]] > 0) this.explodable = true;
    else this.explodable = false;
    if (player.level[ROLLING_MULTIPLIER[0]] > 0) this.rolling = true;
    else this.rolling = false;
    this.rollTimeMax = 500 + (250 * player.level[ROLLING_DURATION[0]]);
    if (player.level[GOLDEN_COOKIE[0]] > 0) this.goldable = true;
    else this.goldable = false;
    this.maxClickCount = 2 + player.level[ROLLING_BONUS[0]];
    this.multiplier = 1 + (((player.level[OVERALL_MULTIPLIER[0]]) * (1 + player.level[MULTIPLIER_BONUS[0]])) / 100);
    if (player.level[AUTOCLICKERS[0]] > 0) this.autoTap = true;
    else this.autoTap = false;
    if (player.level[AUTOCLICKERS[0]] > player.bestAutoclickers) player.bestAutoclickers = player.level[AUTOCLICKERS[0]];
    this.tapRate = 1000 / (player.level[AUTOCLICKERS[0]] / 2);
    if (player.level[EXPLODE_FRENZY[0]] > 0) this.frenzy = true;
    else this.frenzy = false;
    this.frenzyReset = (10 - player.level[FRENZY_COOLDOWN[0]]) * 60000; // frenzy reset time in milliseconds, starting from 10 minutes
    //this.frenzyReset = 0; // testing purposes
    this.frenzyMax = 400 + (50 * player.level[FRENZY_TIME[0]]); // frenzy time in frames per second
    if (this.deltaTime(this.frenzyFinish) >= this.frenzyReset) this.canFrenzy = true;
    else this.canFrenzy = false;
    this.prestigeBonus = (1 + (player.prestige * 0.01)) * Math.pow(2, player.talent[DOUBLE_PRESTIGE_BONUS[0]]);
    this.holdToTapRate = 300 / player.talent[HOLD_TO_TAP[0]];
  };
  setPrice(baseCost, level, costFactor) {
    let price = Math.pow(baseCost, 1 + (level * costFactor));
    return price;
  };
  prestigeAmount(first, second, power) {
    let num = Math.max(0,
      Math.pow(
        Math.pow(10, -6) * Math.min(player.earned, Math.pow(10, first)), power)
      - Math.pow(Math.pow(10, -6), power));
    return num;
  };
  multiply(number) {
    return Math.round(
      (((number + Number.EPSILON) * utility.clickCount) * utility.multiplier) * utility.prestigeBonus
     * 100) / 100;
  };
  round(number) {
    return Math.round((number + Number.EPSILON) * 100) / 100;
  };
  purchasable(index, req) { // check if upgrade purchasable
    let returnValue;
    if (player.level[req] > 0 || req == -1) returnValue = true;
    if (SHOP_BUTTONS[index].oneTimePurchase && player.level[index] > 0) returnValue = false;
    if (player.level[index] >= SHOP_BUTTONS[index].maxLevel) returnValue = false;
    return returnValue;
  };
  upgrade(index) {
    if (player.level[SHOP_BUTTONS[index].requirement] < 1) return;
    if (player.money < player.cost[index]) return;
    if (SHOP_BUTTONS[index].oneTimePurchase && player.level[index] > 0) return;
    if (player.level[index] >= SHOP_BUTTONS[index].maxLevel) return;
    player.money -= player.cost[index];
    player.level[index]++;
    player.upgradesPurchased++;
    player.moneySpent += player.cost[index];
    if (player.cost[index] > player.highestMoneySpent) player.highestMoneySpent = player.cost[index];
    clickEffect.push(new Effects(utility.convert(player.cost[index]), false, "red", 1.2));
    if (index == GOLDEN_COOKIE[0]) { // purchasing golden cookie, give a free gold cookie
      goldCookie.push(new GoldCookie());
    };
    if (index == ADD_CONTAINER[0]) { // give 1 level to newly purchased container
      this.activeContainers = player.level[ADD_CONTAINER[0]];
      CONTAINERS[this.activeContainers - 1].level++;
    };
    game.update();
    player.initPlayer();
    utility.setUgrades();
  };
  convert(number) { // number converter
    if (number < 1e3) return utility.round(number);
    if (number >- 1e3 && number < 1e6) return +(number / 1e3).toFixed(3) + units[0];
    if (number >= 1e6 && number < 1e9) return +(number / 1e6).toFixed(3) + units[1];
    if (number >= 1e9 && number < 1e12) return +(number / 1e9).toFixed(3) + units[2];
    if (number >= 1e12 && number < 1e15) return +(number / 1e12).toFixed(3) + units[3];
    if (number >= 1e15 && number < 1e18) return +(number / 1e15).toFixed(3) + units[4];
    if (number >= 1e18 && number < 1e21) return +(number / 1e18).toFixed(3) + units[5];
    if (number >= 1e21 && number < 1e24) return +(number / 1e21).toFixed(3) + units[6];
    if (number >= 1e24 && number < 1e27) return +(number / 1e24).toFixed(3) + units[7];
    if (number >= 1e27 && number < 1e30) return +(number / 1e27).toFixed(3) + units[8];
    if (number >= 1e30 && number < 1e33) return +(number / 1e30).toFixed(3) + units[9];
    if (number >= 1e33 && number < 1e36) return +(number / 1e33).toFixed(3) + units[10];
    if (number >= 1e36 && number < 1e39) return +(number / 1e36).toFixed(3) + units[11];
    if (number >= 1e39 && number < 1e42) return +(number / 1e39).toFixed(3) + units[12];
    if (number >= 1e42 && number < 1e45) return +(number / 1e42).toFixed(3) + units[13];
    if (number >= 1e45 && number < 1e48) return +(number / 1e45).toFixed(3) + units[14];
    if (number >= 1e48 && number < 1e51) return +(number / 1e48).toFixed(3) + units[15];
    if (number >= 1e51 && number < 1e54) return +(number / 1e51).toFixed(3) + units[16];
    if (number >= 1e54 && number < 1e57) return +(number / 1e54).toFixed(3) + units[17];
    if (number >= 1e57 && number < 1e60) return +(number / 1e57).toFixed(3) + units[18];
    if (number >= 1e60 && number < 1e63) return +(number / 1e60).toFixed(3) + units[19];
    if (number >= 1e63) return "A lot";
  };
  resetScroll (top, bottom) {
    if (top - input.dY > top) { // keep first button from scrolling too far
      input.dY += 5;
      if (top - input.dY > (1.2 * top)) {
        input.dY += 10;
      };
      if (top - input.dY > game.height / 2) {
        input.dY += 50;
      };
    };
    if (bottom - input.dY < (game.height - (3 * game.textSize))) { // keep last button from scrolling too far
      input.dY -= 5;
      if (bottom - input.dY < (game.height - (3.5 * game.textSize))) {
        input.dY -= 10;
      };
      if (bottom - input.dY < game.height / 2) {
        input.dY -= 50;
      };
    };
  };
  fillContainer() {
    if (utility.activeContainers == 0) return;
    for (var i = 0; i < utility.containerFills; i++) {
      for (let j = 0; j < utility.activeContainers; j++) {
        CONTAINERS[j].fill();
      };
    };
  };
  containerAverage()  {
    if (utility.activeContainers == 0) return 0;
    let result = 0;
    for (let i = 0; i < utility.activeContainers; i++) {
      result += CONTAINERS[i].worth;
    };
    return result = result / utility.activeContainers;
  };
  deltaTime(time) {
    let currentTime = Date.now();
    let result = currentTime - time;
    return result;
  };
  update() {
    if (input.dYSmoothing != 0) {
      input.dY += input.dYSmoothing;
      if (input.dYSmoothing < 0) input.dYSmoothing += Math.ceil(-input.dYSmoothing / 10);
      if (input.dYSmoothing > 0) input.dYSmoothing -= (input.dYSmoothing / 10);
      input.dYSmoothing = Math.floor(input.dYSmoothing);
    };
    if (utility.inFrenzy) { // if in frenzy mode
      if (utility.deltaTime(utility.frenzyLeft) > utility.frenzyMax) { // if frenzy time left
        utility.inFrenzy = false;
        utility.canFrenzy = false;
        utility.frenzyFinish = Date.now();
        let dTime = utility.deltaTime(utility.frenzyStart) / 1000;
        if (dTime > player.longestFrenzy) player.longestFrenzy = dTime;
      };
    } else { // frenzy mode is on cooldown
      if (!utility.canFrenzy && utility.deltaTime(utility.frenzyFinish) >= utility.frenzyReset) {
        utility.canFrenzy = true;
      };
    };
    if (player.stackingBonus > 1 && utility.deltaTime(player.rollTimeStart) >= utility.rollTimeMax) { // bonus should end
      let dTime = utility.deltaTime(utility.runningClickCount) / 1000;
      if (player.stackingBonus > player.bestStackingBonus) player.bestStackingBonus = utility.round(player.stackingBonus);
      if (dTime > player.longestStackingBonus) player.longestStackingBonus = dTime;
      utility.runningClickCount = 0;
      player.stackingBonus = 1;
    };
    if (utility.prestigeScreen) utility.prestigeConfirm = true;
    this.prestigeFor = this.prestigeAmount(12, -6, 0.15) + this.prestigeAmount(21, 6, 0.16) + this.prestigeAmount(30, 15, 0.17) + this.prestigeAmount(39, 24, 0.18) + this.prestigeAmount(48, 33, 0.19) + this.prestigeAmount(60, 42, 0.2) +
    Math.max(0, Math.pow(Math.pow(10, -6) * player.earned, 0.21) - Math.pow(Math.pow(10, 54), 0.21));
    if (player.talent[DOUBLE_PRESTIGE_FOR[0]] > 0) {
      this.prestigeFor *= Math.pow(2, player.talent[DOUBLE_PRESTIGE_FOR[0]]);
    };
    this.prestigeForNext = this.prestigeFor - Math.floor(this.prestigeFor);
    if (player.earned > player.bestEarnings) player.bestEarnings = player.earned;
    // check for achievements
    player.updateAchievements();
    for (let i = 0; i < NUMBER_OF_ACHIEVEMENTS; i++) { // check each achievement
      if (player.achievementsEarned[i] < 1) { // if not already earned
        if (ACHIEVEMENTS_PLAYER[i] >= ACHIEVEMENTS[i]) { // achievement earned!
          player.secretIngredients++;
          player.achievementsEarned[i]++;
          player.update();
        };
      };
    };
  };
};

class Cookie {
  constructor() {
    this.x = game.width / 2;
    this.y = game.height / 2;
    this.r = this.radius();
    this.pulseCount = 0;
    this.golden = false;
    this.goldenTimer = 0;
    this.exploding = false;
    this.explode = 0;
    this.explodeFor = 200;
    this.xV = 0;
    this.yV = 0;
    this.dX = Math.sin((Math.random() * (2 * Math.PI))) * 2.5;
    this.dY = Math.cos((Math.random() * (2 * Math.PI))) * 2.5;
  };
  setUgrades() {
    this.pulse = 15 + (player.level[EXPLODE_QUICKER[0]] * 2);
    this.pulseSlow = 1.05 - (player.level[PULSE_SLOW[0]] / PULSE_SLOW[7]);
    this.pulseLimit = this.r * (3 - (3 * (player.level[PULSE_LIMIT[0]] / (PULSE_LIMIT[7] + 3))));
    this.worth = 1 + (player.level[MONEY_PER_CLICK[0]] / 10);
    //this.worth = 7777777777777; // testing purposes
    this.bonusWorth = this.worth * (2 + (player.level[EXPLODE_BONUS[0]] * player.level[EXPLODE_BONUS[0]]));
    this.goldChance = (9999 - player.level[GOLDEN_COOKIE_CHANCE[0]]) / 10000;
    this.goldBonus = 50;
    this.goldenTime = 100 + (player.level[GOLDEN_COOKIE_TIME[0]] * 25);
  };
  radius() {
    if (game.width > game.height) {
      return game.height / 8;
    } else {
      return game.width / 4;
    };
  };
  color() {
    if (cookie.golden) return 3;
    if (this.r + this.pulseCount > this.pulseLimit * 0.95) {
      return 2;
    } else if (this.r + this.pulseCount > this.pulseLimit * 0.75) {
      return 1;
    } else {
      return 0;
    }
  };
  click(playerInput = true) {
    player.cookieClicked++;
    if (playerInput) { // if player tapped cookie
      utility.fillContainer();
      if (utility.rolling) { // if rolling bonus should activate
        player.rollTimeStart = Date.now();
        if (player.stackingBonus == 1) utility.runningClickCount = Date.now();
        for (var i = 0; i <= utility.clickRounds; i++) {
          if (utility.round(player.stackingBonus) < utility.round(utility.maxClickCount)) player.stackingBonus += utility.round(utility.clickIncrease); // increase if less than max rolling bonus
        };
      };
      if (utility.inFrenzy) { // check if frenzy time should increase
        utility.frenzyLeft += 10;
        //if (utility.deltaTime(utility.frenzyLeft) > utility.frenzyMax) utility.frenzyLeft = Date.now();
      };
      if (cookie.r + cookie.pulseCount < cookie.pulseLimit) { // if cookie should expand
        cookie.pulseCount += cookie.pulse;
      } else cookie.reset();
      //game.rotation = Math.sin((Math.random() * (2 * Math.PI)));
    };
    if (cookie.r + cookie.pulseCount < cookie.pulseLimit) {
      cookie.pulseCount += (cookie.pulse / 10);
    };
    let amount = utility.multiply(cookie.worth);
    let clr = "green";
    if (this.golden) {
      amount *= this.goldBonus;
      clr = "gold";
    };
    player.money += amount;
    player.earned += amount;
    player.totalEarnings += amount;
    //clickEffect.push(new Effects(utility.convert(amount), true, clr));
  };
  reset() {
    if (utility.explodable) {
      cookie.pulseCount = 0;
      player.cookieExploded++;
      cookie.exploding = true;
      cookie.explode = cookie.explodeFor;
      for (var i = 0; i < 25; i++) {
        if (explodingCookie.length < 150) explodingCookie.push(new Cookie);
        if (player.level[EXPLOSION_FILL[0]] > 0) utility.fillContainer();
      };
      let amount = utility.multiply(cookie.bonusWorth);
      let clr = "dodgerblue";
      if (utility.inFrenzy) {
        amount *= 100;
        clr = "blue";
      };
      if (this.golden) {
        amount *= this.goldBonus;
        clr = "blueviolet";
      };
      player.money += amount;
      player.earned += amount;
      player.totalEarnings += amount;
      //clickEffect.push(new Effects(utility.convert(amount), true, clr, 1.5));
    };
  };
  draw(x, xV, y, yV, r, pC, column, row) {
    ctxD.imageSmoothingEnabled = true;
    ctxD.imageSmoothingQuality = "high";
    ctxD.drawImage(
      texture, // the texture sheet
      column * game.frameW, // starting x
      row * game.frameH, // starting y
      game.frameW, // width
      game.frameH, // height
      x + xV - r - pC / 2, // destination x
      y + yV - r - pC / 2, // destination y
      (2 * r) + pC, // drawn width
      (2 * r) + pC // drawn height
    );
  };
  update() {
    // update cookie worth
    cookie.setUgrades();
    // deflate the cookie
    if (cookie.pulseCount > 0) {
      cookie.pulseCount -= cookie.pulseSlow;
    };
    if (this.golden) {
      this.goldenTimer--;
    };
    if (this.goldenTimer < 0) this.golden = false;
  };
};

class GoldCookie {
  constructor() {
    this.x = Math.random() * game.width;
    this.y = Math.random() * game.height;
    this.dX = Math.sin((Math.random() * (2 * Math.PI)));
    this.dY = Math.sin((Math.random() * (2 * Math.PI)));
    this.speed = 2 - (player.level[GOLDEN_COOKIE_SPEED[0]] / 10);
    this.size = game.frameW;
  };
  draw() {
    ctxD.imageSmoothingEnabled = true;
    ctxD.imageSmoothingQuality = "high";
    ctxD.drawImage(
      texture, // the texture sheet
      3 * game.frameW, // starting x
      0 * game.frameH, // starting y
      game.frameW, // width
      game.frameH, // height
      this.x + this.dX, // destination x
      this.y + this.dY, // destination y
      this.size, // drawn width
      this.size // drawn height
    );
  };
  click(index) {
    player.goldCookieClicked++;
    cookie.golden = true;
    cookie.goldenTimer += cookie.goldenTime;
    goldCookie[index] = null;
    goldCookie.splice(index, 1);
  };
  update(index) {
    this.x += this.dX * this.speed;
    this.y += this.dY * this.speed;
    if ((this.x > (game.width + this.size) || this.x < (0 - this.size)) || (this.y > (game.height + this.size) || this.y < (0 - this.size))) {
      goldCookie[index] = null;
      goldCookie.splice(index, 1);
    };
  };
};

class Container {
  constructor(position) {
    this.row = 7;
    this.position = position;
    this.baseIndex = position * 6;
    this.x = (position * game.width) / 5;
    this.y = utility.containerTableY - game.frameH;
    this.length = game.frameW * 1.5;
    this.filled = player.containerArray[this.baseIndex + 1];
    this.filling = 0;
    this.full = false;
    this.sin = 0;
    this.sinSwitch = false;
    this.increasing = false;
    this.selling = false;
    this.focused = false;
    this.focusX = this.x + (0.25 * this.length);
    this.focusY = this.y + this.length + (1.5 * game.textSize);
    this.focusLength = 0.5 * this.length;
    this.setUgrades();
  };
  setUgrades() {
    this.level = player.containerArray[this.baseIndex];
    this.levelPrice = utility.setPrice(CONTAINER_LEVEL[4], this.level, CONTAINER_LEVEL[5]);
    this.column = this.level - 1;
    if (this.column > 4) this.column = 4;
    this.cap = this.level * (10 * this.level);
    this.reducedCap = player.containerArray[this.baseIndex + 2];
    this.sizePrice = utility.setPrice(CONTAINER_SIZE[4], this.reducedCap, CONTAINER_SIZE[5]);
    //this.reducedCap = this.cap * (this.size / (CONTAINER_SIZE[7] + 1));
    this.capacity = Math.floor(this.cap - (this.reducedCap * this.level));
    this.price = player.containerArray[this.baseIndex + 3];
    this.pricePrice = utility.setPrice(CONTAINER_PRICE[4], this.price, CONTAINER_PRICE[5]);
    this.worth = (((1 + this.price) * cookie.worth) / 2) * this.cap;
    this.autoFilling = player.containerArray[this.baseIndex + 4];
    this.autoFillingPrice = utility.setPrice(CONTAINER_AUTOCLICK[4], this.price, CONTAINER_AUTOCLICK[5]);
    if (this.autoFilling > 0) this.autoFillingText = "On";
    else this.autoFillingText = "Off";
    this.autoSelling = player.containerArray[this.baseIndex + 5];
    this.autoSellingPrice = utility.setPrice(CONTAINER_AUTOSELL[4], this.price, CONTAINER_AUTOSELL[5]);
    if (this.autoSelling > 0) this.autoSellingText = "On";
    else this.autoSellingText = "Off";
    if (player.level[ADD_CONTAINER[0]] > this.position) this.active = true;
    else this.active = false;
    if (utility.multiply(this.worth) > utility.highestContainerWorth && this.active) utility.highestContainerWorth = utility.multiply(this.worth);
  };
  draw() {
    if (!this.active) return;
    this.y = utility.containerTableY - game.frameH;
    this.focusY = this.y + this.length + (1.5 * game.textSize);
    ctxD.globalAlpha = "0.3";
    ctxD.fillStyle = "black";
    ctxD.beginPath();
    ctxD.ellipse(this.x + (this.length * 0.5), this.y + (this.length * 0.95), this.length * 0.5, this.length * 0.15, 0, 0, 2 * Math.PI); // container shadow
    ctxD.fill();
    ctxD.globalAlpha = "0.3";
    ctxD.drawImage( // the container image
      texture, // the texture sheet
      this.column * game.frameW, this.row * game.frameH, // starting x + y
      game.frameW, game.frameH, // width + height
      this.x, this.y, // destination x + y
      this.length, this.length // drawn width + height
    );
    if (this.full) ctxD.globalAlpha = this.sin;
    else ctxD.globalAlpha = "1";
    ctxD.drawImage( // the overlay container image
      texture, // the texture sheet
      this.column * game.frameW, (1 + this.row) * game.frameH, // starting x + y
      game.frameW, game.frameH  * -(this.filling / this.capacity), // width + height
      this.x, this.y + (this.length), // destination x + y
      this.length, this.length  * -(this.filling / this.capacity) // drawn width + height
    );
    // container upgrading focus selector
    ctxD.globalAlpha = "1";
    if (this.focused) {
      ctxD.font = 0.5 * game.textSize + "px calibri";
      ctxD.textAlign = "center";
      // upgrade level
      ctxD.fillText("Level:", utility.cUpgrade1X + (0.5 * game.frameW), utility.containerTableY * 1.25 + game.frameH);
      ctxD.fillText(this.level, utility.cUpgrade1X + (0.5 * game.frameW), utility.containerTableY * 1.25 + game.frameH * 1.3);
      if (player.money > this.levelPrice) ctxD.fillStyle = "green";
      else ctxD.fillStyle = "lightgrey";
      ctxD.fillRect(utility.cUpgrade1X, game.height - (1.1 * game.frameH), game.frameW, game.frameH);
      ctxD.fillStyle = "black";
      ctxD.fillText("Cost:", utility.cUpgrade1X + (0.5 * game.frameW), utility.containerTableY * 1.25 + game.frameH * 1.8);
      ctxD.fillText(utility.convert(this.levelPrice), utility.cUpgrade1X + (0.5 * game.frameW), utility.containerTableY * 1.25 + game.frameH * 2.1);
      ctxD.fillText(this.level + " -> " + (this.level + 1), utility.cUpgrade1X + (0.5 * game.frameW), utility.containerTableY * 1.25 + game.frameH * 2.4);
      // upgrade capacity
      ctxD.fillText("Capacity:", utility.cUpgrade2X + (0.5 * game.frameW), utility.containerTableY * 1.25 + game.frameH);
      ctxD.fillText(this.filled + "/" + this.capacity, utility.cUpgrade2X + (0.5 * game.frameW), utility.containerTableY * 1.25 + game.frameH * 1.3);
      if (player.money > this.sizePrice) ctxD.fillStyle = "green";
      else ctxD.fillStyle = "lightgrey";
      ctxD.fillRect(utility.cUpgrade2X, game.height - (1.1 * game.frameH), game.frameW, game.frameH);
      ctxD.fillStyle = "black";
      ctxD.fillText("Cost:", utility.cUpgrade2X + (0.5 * game.frameW), utility.containerTableY * 1.25 + game.frameH * 1.8);
      ctxD.fillText(utility.convert(this.sizePrice), utility.cUpgrade2X + (0.5 * game.frameW), utility.containerTableY * 1.25 + game.frameH * 2.1);
      ctxD.fillText(this.reducedCap + " -> " + (this.reducedCap + 1), utility.cUpgrade2X + (0.5 * game.frameW), utility.containerTableY * 1.25 + game.frameH * 2.4);
      // upgrade price
      ctxD.fillText("Price:", utility.cUpgrade3X + (0.5 * game.frameW), utility.containerTableY * 1.25 + game.frameH);
      ctxD.fillText("$" + utility.convert(utility.multiply(this.worth)), utility.cUpgrade3X + (0.5 * game.frameW), utility.containerTableY * 1.25 + game.frameH * 1.3);
      if (player.money > this.pricePrice) ctxD.fillStyle = "green";
      else ctxD.fillStyle = "lightgrey";
      ctxD.fillRect(utility.cUpgrade3X, game.height - (1.1 * game.frameH), game.frameW, game.frameH);
      ctxD.fillStyle = "black";
      ctxD.fillText("Cost:", utility.cUpgrade3X + (0.5 * game.frameW), utility.containerTableY * 1.25 + game.frameH * 1.8);
      ctxD.fillText(utility.convert(this.pricePrice), utility.cUpgrade3X + (0.5 * game.frameW), utility.containerTableY * 1.25 + game.frameH * 2.1);
      ctxD.fillText(this.price + " -> " + (this.price + 1), utility.cUpgrade3X + (0.5 * game.frameW), utility.containerTableY * 1.25 + game.frameH * 2.4);
      // upgrade auto fill
      ctxD.fillText("Auto Fill:", utility.cUpgrade4X + (0.5 * game.frameW), utility.containerTableY * 1.25 + game.frameH);
      ctxD.fillText(this.autoFillingText, utility.cUpgrade4X + (0.5 * game.frameW), utility.containerTableY * 1.25 + game.frameH * 1.3);
      if (player.money < this.autoFillingPrice || this.autoFilling > 0) ctxD.fillStyle = "lightgrey";
      else ctxD.fillStyle = "green";
      ctxD.fillRect(utility.cUpgrade4X, game.height - (1.1 * game.frameH), game.frameW, game.frameH);
      ctxD.fillStyle = "black";
      ctxD.fillText("Cost:", utility.cUpgrade4X + (0.5 * game.frameW), utility.containerTableY * 1.25 + game.frameH * 1.9);
      ctxD.fillText(utility.convert(this.autoFillingPrice), utility.cUpgrade4X + (0.5 * game.frameW), utility.containerTableY * 1.25 + game.frameH * 2.2);
      // upgrade auto sell
      ctxD.fillText("Auto Sell:", utility.cUpgrade5X + (0.5 * game.frameW), utility.containerTableY * 1.25 + game.frameH);
      ctxD.fillText(this.autoSellingText, utility.cUpgrade5X + (0.5 * game.frameW), utility.containerTableY * 1.25 + game.frameH * 1.3);
      if (player.money < this.autoSellingPrice || this.autoSelling > 0) ctxD.fillStyle = "lightgrey";
      else ctxD.fillStyle = "green";
      ctxD.fillRect(utility.cUpgrade5X, game.height - (1.1 * game.frameH), game.frameW, game.frameH);
      ctxD.fillStyle = "black";
      ctxD.fillText("Cost:", utility.cUpgrade5X + (0.5 * game.frameW), utility.containerTableY * 1.25 + game.frameH * 1.9);
      ctxD.fillText(utility.convert(this.autoSellingPrice), utility.cUpgrade5X + (0.5 * game.frameW), utility.containerTableY * 1.25 + game.frameH * 2.2);
      ctxD.fillStyle = "green"; // set color for focus box
    } else ctxD.fillStyle = "lightgrey";
    ctxD.fillRect(this.focusX, this.focusY, this.focusLength, this.focusLength);
  };
  fill() {
    if (!this.active) return;
    if (this.filled < this.capacity) this.filled++;
    //if (this.filled == this.capacity) utility.currentlyFilling++;
  };
  sell() {
    if (player.level[ADD_CONTAINER[0]] < this.position) return;
    if (this.full) {
      player.containersSold++;
      this.filled = 0;
      this.full = false;
      let amount = utility.multiply(this.worth);
      let clr = "orchid";
      if (cookie.golden) {
        amount *= cookie.goldBonus;
        clr = "indigo";
      };
      player.money += amount;
      player.earned += amount;
      player.totalEarnings += amount;
      if (player.highestContainer < amount) player.highestContainer = amount;
      //clickEffect.push(new Effects(utility.convert(amount), true, clr, 1.5));
    };
  };
  upgrade(upgrade, cost) {
    if (player.money < cost) return;
    if (upgrade == 4 || upgrade == 5) {
      if (player.containerArray[this.baseIndex + upgrade] > 0) return;
    };
    if (upgrade == 2) {
      if (this.capacity < 6) return;
    };
    player.containerArray[this.baseIndex + upgrade]++;
    player.money -= cost;
    player.upgradesPurchased++;
    player.moneySpent += cost;
    if (cost > player.highestMoneySpent) player.highestMoneySpent = cost;
    this.setUgrades();
    game.update();
    player.initPlayer();
  };
  update() {
    if (this.filling != this.filled) {
      if (this.filled < this.filling) this.filling -= Math.ceil(this.capacity / 16);
      else this.filling++;
      if (this.filled > this.filling) this.filling++;
    };
    if (this.filled >= this.capacity) this.full = true;
    if (this.autoSelling > 0) {
      if (this.full) this.sell();
    } else {
      if (this.sinSwitch) this.sin -= 0.025;
      else this.sin += 0.025;
      if (this.sin > 0.97) this.sinSwitch = true;
      if (this.sin < 0.03) this.sinSwitch = false;
    };
    player.containerArray[this.baseIndex] = this.level;
    player.containerArray[this.baseIndex + 1] = this.filled;
    player.containerArray[this.baseIndex + 2] = this.reducedCap;
    player.containerArray[this.baseIndex + 3] = this.price;
    player.containerArray[this.baseIndex + 4] = this.autoFilling;
    player.containerArray[this.baseIndex + 5] = this.autoSelling;
    this.setUgrades();
  };
};

class Effects {
  constructor(text, type, color, size = 0.8) {
    this.text = text;
    this.y = 1.5 * game.textSize;
    this.font = size * game.textSize;
    this.x = 0;
    this.type = type;
    this.color = color;
    this.speed = 25 + clickEffect.length;
    this.hue = 0;
  };
};

class Button {
  constructor(btn) {
      //btn[index, texture column, texture row, title, description, base cost, cost factor, max level, one time purchase?, requirement]
    this.width = game.frameW;
    this.height = game.frameH;
    this.index = btn[0];
    this.column = btn[1];
    this.row = btn[2];
    this.title= btn[3];
    this.description = "";
    this.splitDesc = btn[4].split(" ");
    this.lineCount = 0;
    for (let i = 0; i < this.splitDesc.length; i++) {
      if (this.lineCount < 5) {
          this.description += this.splitDesc[i] + " ";
          this.lineCount++;
      } else {
        this.description += "---" + this.splitDesc[i] + " ";
        this.lineCount = 1;
      }
    };
    this.description = this.description.split("---");
    this.baseCost = btn[5];
    this.costFactor = btn[6];
    this.maxLevel = btn[7];
    this.oneTimePurchase = btn[8];
    this.requirement = btn[9];
    this.x = game.textSize / 2;
    this.size = game.frameW * 1.5;
    this.length = game.width - (this.x * 2);
    this.y = (1.2 * this.size * order) + (2.5 * game.textSize);
    order++;
    this.level;
    this.price;
  };
  drawButton() {
    this.level = player.level[this.index];
    this.price = player.cost[this.index];
    ctxD.imageSmoothingEnabled = true;
    ctxD.imageSmoothingQuality = "high";
    ctxD.fillStyle = "white";
    ctxD.fillRect(this.x, this.y - input.dY, this.length, this.size);
    let newRow = this.row;
    if (this.price <= player.money && utility.purchasable(this.index, this.requirement)) { // the button background
      ctxD.fillStyle = "hsl(105, 100%, 50%)";
    } else {
      ctxD.fillStyle = "lightgrey";
      newRow = this.row - 1;
    };
    ctxD.drawImage(
      texture, // the texture sheet
      this.column * game.frameW, newRow * game.frameH, // texture x and y
      game.frameW, game.frameH, // width and height
      this.x, this.y - input.dY, // destination x and y
      this.size, this.size // drawn width and height
    );
    ctxD.fillRect(game.width - this.x - this.size, this.y - input.dY, this.size, this.size); // level box
    ctxD.fillStyle = "black";
    ctxD.textAlign = "center";
    ctxD.textBaseline = "bottom";
    ctxD.font = (game.textSize * 0.5) + "px calibri";
    ctxD.fillText(this.level, game.width - this.x - (this.size / 2), (this.y + this.size) - input.dY); // the button level
    if (this.oneTimePurchase && this.level > 0 || this.maxLevel == this.level) { // purchased
      ctxD.fillText(utility.checkMark, game.width - this.x - (this.size / 2), (this.y + (this.size / 2)) - input.dY);
    } else { // the button price
      ctxD.fillText("$" + utility.convert(this.price), game.width - this.x - (this.size / 2), (this.y + (this.size / 2)) - input.dY);
    };
    ctxD.font = "bold " + (game.textSize * 0.45) + "px calibri";
    ctxD.fillText("Level:", game.width - this.x - (this.size / 2), (this.y + (3 * this.size / 4)) - input.dY); // level text
    ctxD.fillText("Cost:", game.width - this.x - (this.size / 2), (this.y + (this.size / 4)) - input.dY); // price text
    ctxD.textAlign = "left";
    ctxD.fillText(this.title, this.x + (1.1 * this.size), this.y + (this.size / 4) - input.dY);
    ctxD.font = (game.textSize * 0.4) + "px calibri";
    for (let i = 0; i < this.description.length; i++) {
      ctxD.fillText(this.description[i], this.x + (1.1 * this.size), this.y + ((2.6 + i) * this.size / 6) - input.dY); // the button description
    };
  };
};

class Talent {
  constructor(talent) {
    this.index = talent[0];
    this.column = talent [1];
    this.row = talent[2];
    this.title = talent[3];
    this.description = "";
    this.splitDesc = talent[4].split(" ");
    this.maxLevel = talent[5];
    this.lineCount = 0;
    for (let i = 0; i < this.splitDesc.length; i++) {
      if (this.lineCount < 5) {
          this.description += this.splitDesc[i] + " ";
          this.lineCount++;
      } else {
        this.description += "---" + this.splitDesc[i] + " ";
        this.lineCount = 1;
      }
    };
    this.description = this.description.split("---");
    this.width = game.width * 0.9;
    this.height = 2 * game.frameH;
    this.x = game.width * 0.05;
    this.y = (game.height / 2) - (this.height / 2) + (this.index * (this.height * 1.1));
    this.plusY = this.y + (0.5 * this.height);
    this.minusY = this.y + (0.5 * this.height);
    this.plusX = this.x + this.width - (2 * game.frameW);
    this.minusX = this.x + this.width - (game.frameW);
    this.buttonWidth = game.frameW;
    this.buttonHeight = 0.5 * this.height;
    this.level = 0;
  };
  drawTalent() {
    this.level = player.talent[this.index];
    ctxD.textAlign = "center";
    ctxD.textBaseline = "middle";
    ctxD.fillStyle = "white";
    ctxD.fillRect(this.x, this.y - input.dY, this.width, this.height); // talent background
    ctxD.fillStyle = "red";
    ctxD.fillRect(this.minusX, this.minusY - input.dY, this.buttonWidth, this.buttonHeight); // minus talent
    ctxD.fillStyle = "green";
    ctxD.fillRect(this.plusX, this.plusY - input.dY, this.buttonWidth, this.buttonHeight); // plus talent
    ctxD.fillStyle = "white";
    ctxD.font = game.textSize + "px calibri";
    ctxD.fillText(" - ", this.x + this.width - (0.5 * game.frameW), this.y + (3 * this.height / 4) - input.dY);
    ctxD.fillText(" + ", this.x + this.width - (1.5 * game.frameW), this.y + (3 * this.height / 4) - input.dY);
    ctxD.fillStyle = "lightgrey";
    ctxD.fillRect(this.x + this.width - (2 * game.frameW), this.y - input.dY, (2 * game.frameW), 0.5 * this.height);
    ctxD.fillStyle = "black";
    //ctxD.textAlign = "right";
    ctxD.fillText(player.talent[this.index], this.x + this.width - game.frameW, this.y + (this.height / 4) - input.dY);
    ctxD.textAlign = "left";
    ctxD.font = "bold " + game.textSize / 1.5 + "px calibri";
    ctxD.fillText(this.title, this.x, this.y + (this.height / 6) - input.dY);
    ctxD.font = game.textSize / 2 + "px calibri";
    for (let i = 0; i < this.description.length; i++) {
      ctxD.fillText(this.description[i], this.x, this.y + (this.height / 3) + (i * (game.textSize / 2)) - input.dY);
    };
  };
  changeTalent(type) {
    if (type) {
      if (player.secretIngredients < 1) return;
      if (this.level >= this.maxLevel) return;
      player.talent[this.index]++;
      player.secretIngredients--;
    } else {
      if (player.talent[this.index] > 0) {
        player.talent[this.index]--;
        player.secretIngredients++;
      };
    };
    utility.setUgrades();
  };
};

let game = new Game;
let input = new InputHandler;
const SHOP_BUTTONS = [
  new Button(MONEY_PER_CLICK),
  new Button(COOKIE_EXPLODE),
  new Button(EXPLODE_QUICKER),
  new Button(EXPLODE_BONUS),
  new Button(PULSE_SLOW),
  new Button(PULSE_LIMIT),
  new Button(ADD_CONTAINER),
  new Button(AUTOCLICKERS),
  new Button(IDLE_EARNING),
  new Button(ROLLING_MULTIPLIER),
  new Button(ROLLING_DURATION),
  new Button(ROLLING_BONUS),
  new Button(BONUS_INCREASE),
  new Button(CONTAINER_FILL),
  new Button(EXPLOSION_FILL),
  new Button(OVERALL_MULTIPLIER),
  new Button(MULTIPLIER_BONUS),
  new Button(GOLDEN_COOKIE),
  new Button(GOLDEN_COOKIE_TIME),
  new Button(GOLDEN_COOKIE_SPEED),
  new Button(GOLDEN_COOKIE_CHANCE),
  new Button(EXPLODE_FRENZY),
  new Button(FRENZY_TIME),
  new Button(FRENZY_COOLDOWN)
];
const TALENT_BUTTONS = [
  new Talent(HOLD_TO_TAP),
  new Talent(DOUBLE_PRESTIGE_BONUS),
  new Talent(DOUBLE_PRESTIGE_FOR),
  new Talent(FASTER_AUTOCLICKERS),
  new Talent(CHEAPER_PRICES),
  new Talent(INFINITE_BONUS_TIME),
  new Talent(EXPLODE_TO_GOLDEN)
];
game.start();

CONTAINERS.push(new Container(0));
CONTAINERS.push(new Container(1));
CONTAINERS.push(new Container(2));
CONTAINERS.push(new Container(3));
CONTAINERS.push(new Container(4));
player.updateStats();

then = Date.now();
game.loop();
