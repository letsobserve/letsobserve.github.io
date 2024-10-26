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

const NUMBER_OF_UPGRADES = 18; // total shop upgrades
const MONEY_PER_CLICK = [0, 2, // index + texture row
  "Increase the money earned per click", // description
  30, 2, // base cost + cost factor
  99, false, // max level, one time purchase?
  -1]; // requirement
const COOKIE_EXPLODE = [1, 2,
  "The cookie will explode for bonus money",
  150, 1,
  1, true,
  -1];
const EXPLODE_BONUS = [2, 2,
  "Increase bonus when the cookie explodes",
  300, 2.5,
  99,
  false,
  COOKIE_EXPLODE[0]];
const EXPLODE_QUICKER = [3, 2,
  "The cookie will get larger faster",
  300, 3,
  50, false,
  COOKIE_EXPLODE[0]];
const CONTAINER_LEVEL = [10, 2,
  "Increase container level",
  1500, 15,
  5, false,
  -1];
const CONTAINER_SIZE = [11, 2,
  "Decrease size of container",
  2000, 7.5,
  50, false,
  CONTAINER_LEVEL[0]];
const CONTAINER_PRICE = [12, 2,
   "Increase container sell price",
   2500, 4.5,
   99, false,
   CONTAINER_LEVEL[0]];
const CONTAINER_AUTOCLICK = [13, 2,
  "Auto clicks fill up containers",
  15000, 1,
  1, true,
  CONTAINER_LEVEL[0]];
const CONTAINER_AUTOSELL = [14, 2,
  "Auto sells full containers",
  30000, 1,
  1, true,
  CONTAINER_LEVEL[0]];
const ROLLING_MULTIPLIER = [4, 2,
  "A stacking bonus for quick clicks",
  10000, 1,
  1, true,
  -1];
const ROLLING_DURATION = [5, 2,
  "Increase the time before the bonus expires",
  20000, 5,
  99, false,
  ROLLING_MULTIPLIER[0]];
const ROLLING_BONUS = [6, 2,
  "Increase max bonus for clicking",
  25000, 5.5,
  99,  false,
  ROLLING_MULTIPLIER[0]];
const OVERALL_MULTIPLIER = [7, 2,
  "Overall multiplier",
  20000, 8,
  99, false,
  -1];
const AUTOCLICKERS = [8, 2,
  "The cookie will auto click periodically",
  8500, 4.5,
  50, false,
  -1];
const GOLDEN_COOKIE = [9, 2,
  "Unlock golden cookies",
  5000000, 1,
  1, true,
  -1];
const EXPLODE_FRENZY = [15, 2,
  "Unlock Explode Frenzy",
  10000000, 1,
  1, true,
  -1];
const PULSE_SLOW = [16, 4,
  "The cookie will shrink at a slower pace",
  4000, 2.5,
  50, false,
  -1];
const PULSE_LIMIT = [17, 4,
 "Reduce the size before the cookie explodes",
 5000, 5,
 50, false,
 -1];

let lastTime = 0;
let now = new Date();
let time = now.getTime();
let expireTime = time + (365 * 24 * 60 * 60);
let latestTime, then, elapsed, timer, touchEvent;
let clickEffect = [];
let explodingCookie = [];
let xDown = null;
let yDown = null;

class Game {
  constructor() {
    this.width = dimension[0];
    this.height = dimension[1];
    this.frameW = 120;
    this.frameH = 120;
    this.FPS = 60;
    // state the game is
    // 0 = Start menu, 1 = Cookie screen, 2 = Shop, 3 = Prestige, 4 = add 3rd screen
    this.states = [0, 1, 2, 3, 4]; // states the game can be in
    this.state = 0;
    this.textSize = 45 * (this.height / this.width);
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
      0 * game.frameW, // starting x
      0 * game.frameH, // starting y
      game.frameW, // width
      game.frameH, // height
      (game.width / 2) - cookie.r, // destination x
      (game.height / 4) - cookie.r, // destination y
      (2 * cookie.r), // drawn width
      (2 * cookie.r) // drawn height
    );
    ctxS.fillStyle = "white"; // button color
    ctxS.fillRect(game.width / 4, game.height / 2, game.width / 2, 2 * game.textSize); // play button
    ctxS.fillRect(game.width / 4, (game.height / 2) + (2.5 * game.textSize), game.width / 2, 2 * game.textSize); // exit button
    ctxS.fillStyle = "black"; // game title color
    ctxS.textAlign = "center"; // game title alignment
    ctxS.textBaseline = "middle"; // game title alignment
    ctxS.font = "small-caps bolder " + 2 * this.textSize + "px calibri"; // game title
    ctxS.fillText("Cookie", game.width / 2, (game.height / 4) - cookie.r); // game title
    ctxS.fillText("Frenzy", game.width / 2, (game.height / 4) + cookie.r); // game title
    ctxS.font = this.textSize + "px calibri";
    ctxS.fillText("Play", game.width / 2, (game.height / 2) + game.textSize);
    ctxS.fillText("Exit", game.width / 2, (game.height / 2) + (3.5 * game.textSize));
  };
  drawMenu() { // draw the top menu bar
    if (game.state > 0) { // if not on start screen
      // money area
      ctxD.fillStyle = "white";
      ctxD.fillRect(0, 0, this.width, 3 * this.textSize);
      ctxD.fillStyle = "lightgrey";
      ctxD.fillRect(0, 2 * this.textSize, this.width, 1 * this.textSize);
      ctxD.fillStyle = "black";
      ctxD.textAlign = "center";
      ctxD.textBaseline = "middle";
      ctxD.font = this.textSize / 1.5 + "px calibri";
      ctxD.globalAlpha = 0.5;
      ctxD.fillText("Shop", this.width / 2, 2.5 * this.textSize);
      ctxD.textAlign = "right";
      ctxD.fillText("Prestige", this.width - 10, 2.5 * this.textSize);
      ctxD.textAlign = "left";
      ctxD.fillText("Menu", 10, 2.5 * this.textSize);
      ctxD.globalAlpha = 1;
      if (game.state == 2) { // shop screen
        ctxD.textAlign = "center";
        ctxD.fillText("Shop", this.width / 2, 2.5 * this.textSize);
      };
      if (game.state == 3) { // prestige screen
        ctxD.textAlign = "right";
        ctxD.fillText("Prestige", this.width - 10, 2.5 * this.textSize);
      };
      if (game.state == 4) { // menu screen
        ctxD.textAlign = "left";
        ctxD.fillText("Menu", 10, 2.5 * this.textSize);
      };
      ctxD.textAlign = "left";
      ctxD.textBaseline = "top";
      ctxD.font = game.textSize + "px calibri";
      ctxD.fillText("$" + utility.convert(utility.money), 5, 5); // draw money
      ctxD.font = game.textSize / 2 + "px calibri";
      ctxD.textAlign = "right";
      ctxD.fillText(utility.convert(player.EPS) + " $/s", game.width - 5, 0.25*game.textSize); // draw the money per second
      for (let i = 0; i < clickEffect.length; i++) { // draw the earned money
        ctxD.textAlign = "center";
        ctxD.textBaseline = "middle";
        ctxD.lineWidth = "3";
        if (clickEffect[i].time < 1) {
          ctxD.font = (clickEffect[i].font - (clickEffect[i].time * game.textSize)) + "px calibri";
          //console.log(clickEffect[i].time);
          ctxD.globalAlpha = 0.65 - clickEffect[i].time;
          if (clickEffect[i].type) { // show earn money or lose money
            ctxD.fillStyle = "green";
            ctxD.strokeStyle = "darkgreen";
            ctxD.fillText("+$" + clickEffect[i].text, clickEffect[i].x * clickEffect[i].time, clickEffect[i].y);
            ctxD.strokeText("+$" + clickEffect[i].text, clickEffect[i].x * clickEffect[i].time, clickEffect[i].y);
          } else {
            ctxD.fillStyle = "red";
            ctxD.strokeStyle = "darkred";
            ctxD.fillText("-$" + clickEffect[i].text, clickEffect[i].x * clickEffect[i].time, clickEffect[i].y);
            ctxD.strokeText("-$" + clickEffect[i].text, clickEffect[i].x * clickEffect[i].time, clickEffect[i].y);
          };
          clickEffect[i].time += 0.01;
          ctxD.globalAlpha = 1;
        } else {
          clickEffect.splice(0, 1);
        }
      };
    };
  };
  update() {
    utility.update();
    cookie.update();
    if (utility.level[CONTAINER_LEVEL[0]] > 0) container.update();
    player.update(now);
  };
  loop(now) {
    now = Date.now();
    elapsed = now - then;
    if (elapsed > 1000 / game.FPS) { // throttle based on FPS
      then = now - (elapsed % (1000 / game.FPS));
      ctxS.clearRect(0, 0, game.width, game.height);
      ctxD.clearRect(0, 0, game.width, game.height);
      if (game.state > 0) game.update(); // update the game parameters
      if (game.state == 0) { // draw the start menu
        game.drawStartScreen();
      } else if (game.state == 1) { // draw the cookie screen
        game.drawBackground();
        utility.drawDynamic();
        // draw the cookie
        cookie.draw(cookie.x, cookie.xV, cookie.y, cookie.yV, cookie.r, cookie.pulseCount, cookie.color(), 0);
        if (goldCookie.gold && !utility.upgrading) { // draw golden cookie
          goldCookie.draw(goldCookie.rX, 0, goldCookie.rY, 0, goldCookie.rR, 0, 3, 0);
          goldCookie.goldCount--;
        };
        if (utility.level[CONTAINER_LEVEL[0]] > 0) container.draw();
        if (player.returning) { // display when player returns
          player.returns();
        };
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
      game.drawMenu();
    };
    if (!lastTime || now - lastTime >= ((1000 - utility.tapRate) / (utility.level[AUTOCLICKERS[0]] / 2))) { // auto click occasionally
      lastTime = now;
      cookie.click(false);
      if (utility.level[CONTAINER_AUTOCLICK[0]] > 0) container.fill();
    };
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
    };
    if (game.state == 1) { // player cookie screen
      if (player.returning) player.returning = false;
      if (!this.tap) { // if player didnt tap the screeen
        if ((Math.pow(x - cookie.x, 2) + Math.pow(y - cookie.y, 2)) < Math.pow(cookie.r + cookie.pulseCount, 2)) { // check if in the cookie
          cookie.click();
        };
        if (goldCookie.gold && (Math.pow(x - goldCookie.rX, 2) + Math.pow(y - goldCookie.rY, 2)) < Math.pow(goldCookie.rR, 2)) { // check if inside golden cookie
          goldCookie.click();
          goldCookie.goldReset();
        };
      };
      if (yDown > container.y && xDown > container.x) { //check if container is tapped
        container.sell();
      };
      if (yDown > 2 * game.textSize + 10 && yDown < 2 * game.textSize + 10 + game.frameH && xDown > 10 && xDown < game.width - 2 * game.frameW) {
        if (utility.canFrenzy) {
          utility.frenzyLeft = utility.frenzyMax;
          utility.inFrenzy = true;
          utility.canFrenzy = false;
        };
      };
    };
    if (game.state == 2) { // shop screen
      if (x > SHOP_BUTTONS[0].x && x < (SHOP_BUTTONS[0].x + SHOP_BUTTONS[0].length) && y > 2.5 * game.textSize) { // check if in upgrade button area
        for (let i = 0; i < NUMBER_OF_UPGRADES; i++) { // check each button
          if (y > SHOP_BUTTONS[i].y - input.dY && y < SHOP_BUTTONS[i].y + SHOP_BUTTONS[i].size - input.dY) {
            utility.upgrade(i);
            break;
          };
        };
      };
    };
    if (game.state == 3) { // prestige screen
      if (!utility.prestigeConfirm && x > game.width / 4 && x < ((3 * game.width) / 4) && y > game.height / 2 && y < game.height / 2 + (3 * game.textSize)) { // click on prestige button
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
    };
    if (game.state == 4) { // menu screen
      if (y > ((PLAYER_STATS.length + 3.5) * game.textSize - input.dY) && y < (PLAYER_STATS.length + 3.5) * game.textSize - input.dY + game.textSize) { // reset ALL button
        player.reset(true);
      };
    };
    if (y > 2 * game.textSize && y < 3 * game.textSize) { // navigation button area
      input.dY = 0;
      if (x > game.width / 3 && x < game.width - (game.width / 3)) { // shop button clicked
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
    e.preventDefault();
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
        if (goldCookie.gold && (Math.pow(ongoingTouches[i].clientX - goldCookie.rX, 2) + Math.pow(ongoingTouches[i].clientY - goldCookie.rY, 2)) < Math.pow(goldCookie.rR, 2)) { // check if inside golden cookie
          goldCookie.click();
          goldCookie.goldReset();
        };
        if (yDown > container.y && xDown > container.x) { //check if container is tapped
          container.sell();
        };
      };
    };
    if (!timer) {
      timer = setInterval(this.longTouch, 250);
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
      if (xDiff > 0) { // left swipe
        // console.log("left");
      } else { // right swipe
        // console.log("right");
      };
    } else {
      if (yDiff > 0) { // up swipe
        this.dY += yDiff / 2;
        if (utility.upgrading && yDown > game.height - game.textSize) {
          utility.upgrading = false;
        } else if (!utility.upgrading && yDown > game.height - (3 * game.textSize) && xDown > game.width - (3 * game.textSize)) {
          container.sell();
        };
        yDown = yUp;
      } else { // down swipe
        this.dY += yDiff / 2;
        if (yDown < game.textSize) {
          utility.upgrading = true;
        };
        yDown = yUp;
      };
    };
  };
  longTouch() {
    let e = touchEvent.touches[0];
    input.click(e.clientX, e.clientY);
  };
};

class Player {
  constructor() {
    this.lastPlay = utility.parseFromLocalStorage("playerLatestTime", game.time);
    this.lastEPS = utility.parseFromLocalStorage("playerBestEPS", 0);
    this.lastPlaySeconds = (game.time - this.lastPlay) / 1000;
    this.returnWorth = Math.ceil(utility.level[MONEY_PER_CLICK[0]] * this.lastPlaySeconds);
    this.totalEarnings = utility.parseFromLocalStorage("playerTotalEarnings", 0);
    this.spent = utility.parseFromLocalStorage("playerSpent", 0);
    this.prestiges = utility.parseFromLocalStorage("playerPrestiges", 0);
    this.earnedThen = utility.earned; // previous earned
    this.earnedNow = 0; // earning now
    this.EPS = 0; // player earning per second
    if (this.lastPlaySeconds > (2 * 60)) { // if time since last played is more than 2 minutes
      this.returning = true;
      // add money to the player
      utility.money += this.returnWorth;
      utility.earned += this.returnWorth;
    } else {
      this.returning = false;
    };
    setInterval(this.calcEarning.bind(this), 1500);
  };
  returns() {
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
    ctxD.fillText("It's been", (game.width / 2), (game.height / 3.5));
    ctxD.fillText((player.lastPlaySeconds / 60).toFixed(1), game.width / 2, (game.height / 3.5) + game.textSize);
    ctxD.fillText("minutes", game.width / 2, (game.height / 3.5) + (2 * game.textSize));
    ctxD.font = (game.textSize / 0.7) + "px calibri";
    ctxD.fillText("Earning", game.width / 2, (game.height / 3.5) + (3 * game.textSize));
    ctxD.font = game.textSize + "px calibri";
    ctxD.fillText("$" + utility.convert(player.returnWorth), game.width / 2, (game.height / 3.5) + (4.5 * game.textSize));
    ctxD.font = game.textSize / 2 + "px calibri";
    ctxD.fillText("Tap to Continue", game.width / 2, (game.height / 4) + (7 * game.textSize));
  };
  calcEarning() {
    this.earnedNow = utility.earned; // get how much player has earned
    // get the difference between earned now and earned then over time
    this.EPS = Math.round((this.earnedNow - this.earnedThen) / 1.5);
    this.earnedThen = this.earnedNow;
  };
  updateStats() {
    PLAYER_STATS = [
      "Cookie Worth: " + utility.convert(cookie.worth),
      "Cookie Explode Worth: " + utility.convert(cookie.bonusWorth),
      "Container Worth: " + utility.convert(container.worth),
      "Current Multiplier: " + utility.convert(utility.multiplier),
      "Prestige: " + utility.convert(utility.prestige),
      "Total Prestiges: " + utility.convert(player.prestiges),
      "Total Money Spent: " + utility.convert(player.spent),
      "Lifetime Earnings: " + utility.convert(player.totalEarnings),
      "Highest Earnings Per Second: " + utility.convert(player.lastEPS),
      "Clicked Cookie: " + utility.convert(cookie.clicked),
      "Cookie Exploded: " + utility.convert(cookie.exploded),
      "Containers sold: " + utility.convert(container.sold),
      "Golden Cookies Clicked: " + utility.convert(cookie.goldCookieClicked),
      "Upgrades Purchased: " + utility.convert(utility.purchased),
      "Most Expensive Container Sold: ",
      "Most Auto Clickers: ",
      "Highest Stacking Bonus: ",
      "Longest Stacking Bonus: ",
      "Times Activated Frenzy: ",
      "Longest Frenzy: ",
      "Last Stat!"
    ];
  };
  reset(everything) {
    utility.money = 0;
    utility.earned = 0;
    player.totalEarnings = 0;
    cookie.pulse = 0;
    player.earnedThen = 0;
    player.earnedNow = 0;
    cookie.gold = false;
    utility.level = [];
    for (let i = 0; i < NUMBER_OF_UPGRADES; i++) {
      utility.level.push(0);
    };
    if (!everything) {
      this.prestige += this.prestigeFor;
      player.prestiges++;
      player.update(now);
      utility = new Utility;
      game.state = 1;
      return;
    };
    container.sold = 0;
    cookie.goldCookieClicked = 0;
    utility.purchased = 0;
    player.spent = 0;
    player.prestiges = 0;
    player.EPS = 0;
    player.lastEPS = 0;
    utility.prestige = 0;
    cookie.clicked = 0;
    cookie.exploded = 0;
    player.update(now);
    utility = new Utility;
    window.location.reload();
  };
  update(now) {
    // set up a save function
    localStorage.setItem("playerMoney", utility.money);
    localStorage.setItem("playerMoneyEarned", utility.earned);
    localStorage.setItem("playerTotalEarnings", player.totalEarnings);
    localStorage.setItem("playerUpgrades", utility.level);
    localStorage.setItem("upgradeCosts", utility.cost);
    localStorage.setItem("playerLatestTime", latestTime);
    localStorage.setItem("playerPrestige", utility.prestige);
    localStorage.setItem("playerCookieClicked", cookie.clicked);
    localStorage.setItem("playerCookieExploded", cookie.exploded);
    localStorage.setItem("playerContainersSold", container.sold);
    localStorage.setItem("playerGoldCookieClicked", cookie.goldCookieClicked);
    localStorage.setItem("playerUpgradesPurchased", utility.purchased);
    localStorage.setItem("playerSpent", player.spent);
    localStorage.setItem("playerPrestiges", player.prestiges);
    if (player.lastEPS <= player.EPS) {
      player.lastEPS = player.EPS;
      localStorage.setItem("playerBestEPS", player.lastEPS);
    };
  };
};

class Utility {
  constructor() {
    this.checkMark = "\uD83D\uDDF9";
    this.time = 0;
    this.money = this.parseFromLocalStorage("playerMoney",0);
    this.earned = this.parseFromLocalStorage("playerMoneyEarned",0);
    this.costFactor = [];
    this.level = [];
    this.cost = [];
    this.setUgrades();
    this.switch = false;
    this.clickCount = 1; // current click count
    this.canFrenzy = true;
    this.inFrenzy = false;
    this.frenzyMax = 120; // frenzy time in frames per second
    this.frenzyLeft = 0;
    this.frenzyReset = 0;
    this.frenzyResetMax = 10 * 60 * 60; // frenzy reset time in milliseconds
    this.prestige = this.parseFromLocalStorage("playerPrestige",0);
    this.prestigeBonus = (1 + ((this.prestige) * 0.1));
    this.prestigeUpgrade = 0;
    this.prestigeFor = Math.floor(Math.pow((1 + this.prestigeUpgrade) * (this.money / 1000000000), 0.15));
    this.purchased = 0;
  };
  parseFromLocalStorage(key, defaultValue) {
    const value = parseInt(localStorage.getItem(key));
    return Number.isInteger(value) ? value : defaultValue;
  }
  drawDynamic() { // draw the dynamic cookie screen
    ctxD.textAlign = "center";
    ctxD.fillStyle = "black";
    ctxD.textAlign = "left";
    ctxD.textBaseline = "top";
    ctxD.font = game.textSize + "px calibri";
    if (utility.rolling) { // draw the rolling multiplier
      // bounding ellipse
      ctxD.fillStyle = "white";
      ctxD.fillRect(
        0, game.height - game.textSize, // x & y
        game.width, game.textSize // width & height
      );
      // slow filling timer
      if (this.clickCount > 0) {
        ctxD.globalAlpha = 1.05 - (utility.time / utility.rollTime);
        ctxD.fillStyle = "rgb(255,0,0)";
        ctxD.fillRect(
          0, game.height - game.textSize, // x & y
          game.width * (utility.time / utility.rollTime), game.textSize // width & height
        );
      };
      ctxD.globalAlpha = 1;
      ctxD.fillStyle = "black";
      ctxD.textAlign = "center";
      ctxD.textBaseline = "bottom";
      ctxD.font = game.textSize + "px calibri";
      // counter
      ctxD.strokeStyle = "darkergrey";
      ctxD.textAlign = "right";
      ctxD.lineWidth = 5;
      ctxD.strokeText("x " + utility.round(utility.clickCount), game.width - 10, game.height);
      ctxD.lineWidth = 5;
      ctxD.fillText("x " + utility.round(utility.clickCount), game.width - 10, game.height);
      ctxD.lineWidth = 1;
    };
    if (this.frenzy) { // draw the frenzy bar
      ctxD.fillStyle = "white";
      ctxD.textBaseline = "top";
      ctxD.textAlign = "center";
      ctxD.font = game.textSize + "px calibri";
      if (this.canFrenzy) ctxD.fillStyle = "green";
      ctxD.fillRect(10, 2 * game.textSize + 10, game.width - 2 * game.textSize, game.textSize); // base frenzy bar
      ctxD.fillStyle = "red";
      if (utility.inFrenzy) { // time left bar if in frenzy
        ctxD.fillRect(10, 2 * game.textSize + 10, (utility.frenzyLeft / utility.frenzyMax) * (game.width - 2 * game.textSize), game.textSize);
      } else {
        ctxD.globalAlpha = 0.5;
        ctxD.fillRect(10, 2 * game.textSize + 10, (utility.frenzyReset / utility.frenzyResetMax) * (game.width - 2 * game.textSize), game.textSize);
        ctxD.globalAlpha = 1;
      };
      ctxD.fillStyle = "black";
      ctxD.fillText("Frenzy", (game.width - 2 * game.frameW) / 2, 2 * game.textSize + 10);
    };
  };
  drawShop() { // draw the dynamic upgrade screen
    for (let i = 0; i < NUMBER_OF_UPGRADES; i++) {
      SHOP_BUTTONS[i].drawButton();
    };
    utility.resetScroll(SHOP_BUTTONS[0].y, SHOP_BUTTONS[15].y); // first btn + last btn
  };
  drawPrestigeScreen() { // draw the dynamic prestige screen
    ctxD.fillStyle = "black";
    ctxD.textAlign = "center";
    ctxD.textBaseline = "middle";
    ctxD.font = game.textSize + "px calibri";
    ctxD.lineWidth = 10;
    ctxD.fillText("Total Earnings: " + utility.convert(utility.earned), game.width / 2, 4 * game.textSize);
    ctxD.font = game.textSize / 1.5 + "px calibri";
    ctxD.fillText("You have: " + utility.convert(utility.prestige) + "  prestige", game.width / 2, 4.85 * game.textSize);
    ctxD.font = game.textSize / 2 + "px calibri";
    ctxD.fillText("increasing your earnings by: x" +  utility.convert(utility.prestigeBonus), game.width / 2, 5.5 * game.textSize);// calculate how much the prestige amplifies profits
    ctxD.fillStyle = "white";
    ctxD.fillRect(game.width / 2 - (game.width / 4), game.height / 2, game.width / 2, 3 * game.textSize); // the prestige button
    ctxD.fillStyle = "black";
    ctxD.textBaseline = "top";
    ctxD.font  = game.textSize / 2 + "px calibri";
    ctxD.fillText("Prestige for :", game.width / 2, (game.height / 2) + (game.textSize / 3)); // prestige button text
    ctxD.fillText("currency", game.width / 2, (game.height / 2) + (game.textSize * 2)); // prestige units
    ctxD.font = game.textSize / 1.5 + "px calibri";
    ctxD.fillText(utility.convert(utility.prestigeFor), game.width / 2, (game.height / 2) + (game.textSize)); // prestige amount
    ctxD.font = game.textSize / 2 + "px calibri";
    ctxD.textAlign = "center";
    ctxD.fillText("Prestiging gives you additional profits,", game.width / 2, game.height - (3 * game.textSize));
    ctxD.fillText("however your progress is reset.", game.width / 2, game.height - (2.5 * game.textSize));
    ctxD.fillText("(It's always worth it to prestige!)", game.width / 2, game.height - (2 * game.textSize)); // prestige information text
    if (utility.prestigeConfirm) { // prestige confirm screen
      ctxD.fillStyle = "black";
      ctxD.globalAlpha = "0.5";
      ctxD.fillRect(0, 0, game.width, game.height);
      ctxD.globalAlpha = "1";
      ctxD.fillStyle = "white";
      ctxD.fillRect(game.width / 2 - (game.width / 3), game.height / 2 - (3 * game.textSize / 2), game.width / 1.5, 3 * game.textSize);
      ctxD.fillStyle = "black";
      ctxD.fillText("Are you sure?", game.width / 2, game.height / 2.2);
      ctxD.fillStyle = "green";
      ctxD.fillRect(game.width / 2 - (2 * game.textSize), game.height / 2, game.textSize, game.textSize);
      ctxD.fillStyle = "red";
      ctxD.fillRect(game.width / 2 + (game.textSize), game.height / 2, game.textSize, game.textSize);
    };
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
    for (let i = 0; i < PLAYER_STATS.length; i++) {
      ctxD.fillText(PLAYER_STATS[i], 20, (i + 3.5) * game.textSize - input.dY);
    };
    utility.resetScroll(3.5 * game.textSize, (PLAYER_STATS.length + 3.5) * game.textSize);
    player.updateStats();
  };
  setUgrades() {
    try { // get the player details
      this.getLevel = localStorage.getItem("playerUpgrades").split(",");
      for (let i = 0; i < NUMBER_OF_UPGRADES; i++) {
        let temp = parseInt(this.getLevel[i]);
        if (!Number.isInteger(temp)) { // if storage doesnt contain enough upgrades
          temp = 0;
        };
        this.level.push(temp);
      };
    } catch { // set new player
      for (let i = 0; i < NUMBER_OF_UPGRADES; i++) {
        this.level.push(0);
      };
    };
    this.cost = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (let i = 0; i < NUMBER_OF_UPGRADES; i++) {
      this.cost[i] = SHOP_BUTTONS[i].baseCost * (1 + (this.level[i] * SHOP_BUTTONS[i].costFactor));
    }
    // this.cost = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]; // testing purposes
    if (this.level[COOKIE_EXPLODE[0]] > 0) this.explodable = true;
    else this.explodable = false;
    if (this.level[ROLLING_MULTIPLIER[0]] > 0) this.rolling = true;
    else this.rolling = false;
    this.rollTime = 15 * (1 + this.level[ROLLING_DURATION[0]])
    if (this.level[GOLDEN_COOKIE[0]] > 0) this.goldable = true;
    else this.goldable = false;
    this.maxClickCount = 2 + (this.level[ROLLING_BONUS[0]] * 2);
    this.multiplier = 1 + (this.level[OVERALL_MULTIPLIER[0]] / 10);
    if (this.level[AUTOCLICKERS[0]] > 0) this.autoTap = true;
    else this.autoTap = false;
    this.tapRate = 0; // future prestige talent
    if (this.level[EXPLODE_FRENZY[0]] > 0) this.frenzy = true;
    else this.frenzy = false;
  };
  multiply(number) {
    return Math.round(
      (((number + Number.EPSILON) * utility.clickCount) * utility.multiplier) * utility.prestigeBonus
     * 100) / 100;
  };
  round(number) {
    return Math.round((number + Number.EPSILON) * 100) / 100;
  };
  purchasable(index, requirement) { // check if upgrade purchasable
    let returnValue;
    if (utility.level[requirement] > 0 || requirement == -1) returnValue = true;
    if (SHOP_BUTTONS[index].oneTimePurchase && utility.level[index] > 0) returnValue = false;
    if (utility.level[index] >= SHOP_BUTTONS[index].maxLevel) returnValue = false;
    return returnValue;
  };
  upgrade(index) {
    if (utility.money < utility.cost[index]) return;
    if (SHOP_BUTTONS[index].oneTimePurchase && utility.level[index] > 0) return;
    if (utility.level[index] >= SHOP_BUTTONS[index].maxLevel) return;
    utility.money -= utility.cost[index];
    utility.level[index]++;
    utility.purchased++;
    player.spent += utility.cost[index];
    clickEffect.push(new Effects(utility.convert(utility.cost[index]), false));
    game.update();
    utility.setUgrades();
  };
  alternate() { // alternate positions
    var choice = [];
    if (this.switch) {
      choice.push(game.textSize * 2);
    } else {
      choice.push(game.textSize);
    }
    this.switch = !this.switch;
    return choice;
  };
  units() { // currency units
    return [
      "K",//"Thousands",
      "M",//"Million",
      "B",//"Billion",
      "T",//"Trillion",
      "q",//"Quadrillion",
      "Q",//"Quintillion",
      "s",//"Sextillion",
      "S",//"Septillion",
      "o",//"Octillion",
      "N",//"Nonillion",
      "d",//"Decillion",
      "U",//"Undecillion",
      "D",//"Duodecillion",
      "Td",//"Tredecillion",
      "qd",//"Quattuordecillion",
      "Qd",//"Quindecillion",
      "sd",//"Sexdecillion",
      "Sd",//"Septdecillion",
      "Od",//"Octodecillion",
      "Nd",//"Novemdecillion",
      "V",//"Vigintillion",
      "uV",//"Unvigintillion",
      "dV",//"Duovigintillion",
      "tV",//"Trevigintillion",
      "qV",//"Quattuorvigintillion",
      "QV",//"Quinvigintillion",
      "sV",//"Sexvigintillion",
      "SV",//"Septvigintillion",
      "OV",//"Octovigintillion",
      "NV",//"Novemvigintillion",
      "TG",//"Trigintillion"
    ];
  };
  convert(number) { // number converter
    if (number > 10000) {
      var arr = [];
      var str = number.toPrecision(4);
      var splitString = str.split("");
      var unitString = str.split("e+");
      var unit = Math.floor(unitString[1] / 3) - 1;
      arr.push(splitString[0]); // push the first digit
      if (Number.isInteger((unitString[1] - 1) / 3)) { // push the second digit
        arr.push(splitString[2]);
      };
      if (Number.isInteger((unitString[1] - 2) / 3)) { // push the third digit
        arr.push(splitString[2]);
        arr.push(splitString[3]);
      };
      arr.push(".");
      var intermediate = arr.length;
      for (var x = intermediate; x < (intermediate + 2); x++) {
        arr.push(splitString[x]);
      };
      var result = arr.join("");
      var final = result + "" + utility.units()[unit];
      return final;
    } else {
      return utility.round(number);
    };
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
  update() {
    this.prestigeFor = Math.floor(Math.pow((1 + this.prestigeBonus) * (this.money / 1000000000), 0.15));
    if (utility.frenzyLeft > 0) {
      utility.frenzyLeft--;
    } else {
      utility.inFrenzy = false;
    };
    if (!utility.canFrenzy && utility.frenzyReset <= utility.frenzyResetMax) {
      utility.frenzyReset++;
    } else {
      utility.canFrenzy = true;
      utility.frenzyReset = 0;
    };
    // count time between clicks
    if (utility.time > 0) {
      utility.time--;
    } else utility.clickCount = 1;
    if (utility.prestigeScreen) utility.prestigeConfirm = true;
  };
};

class Cookie {
  constructor() {
    this.x = game.width / 2;
    this.y = game.height / 2;
    this.r = this.radius();
    this.pulseCount = 0;
    this.setUgrades();
    this.clicked = utility.parseFromLocalStorage("playerCookieClicked", 0);
    this.exploded = utility.parseFromLocalStorage("playerCookieExploded", 0);
    this.goldCookieClicked = utility.parseFromLocalStorage("playerGoldCookieClicked", 0);
    this.exploding = false;
    this.explode = 0;
    this.explodeFor = 200;
    this.xV = 0;
    this.yV = 0;
    this.dX = Math.sin((Math.random() * (2 * Math.PI)));
    this.dY = Math.cos((Math.random() * (2 * Math.PI)));
    // golden cookie specifics
    this.rR = this.r / 6;
    this.rX = Math.random() * (game.width - (4 * this.rR)) + (2 * this.rR);
    this.rY = Math.random() * (game.height - (6 * game.textSize) - (4 * this.rR)) + ((3 * game.textSize) + (2 * this.rR));
    this.gold = false;
    this.goldCount = 0;
  };
  setUgrades() {
    this.pulse = 15 + (utility.level[EXPLODE_QUICKER[0]] * 5);
    this.pulseSlow = 1.05 - (utility.level[PULSE_SLOW[0]] / PULSE_SLOW[5]);
    this.pulseLimit = this.r * (3 - (3 * (utility.level[PULSE_LIMIT[0]] / (PULSE_LIMIT[5] + 3))));
    this.worth = utility.multiply(1 + (utility.level[MONEY_PER_CLICK[0]] / 5));
    //this.worth = 100000000; // testing purposes
    this.bonusWorth = utility.multiply(this.worth * (2 + (utility.level[EXPLODE_BONUS[0]] / 2)));
    this.goldWorth = this.bonusWorth * utility.level[EXPLODE_BONUS[0]];
  };
  radius() {
    if (game.width > game.height) {
      return game.height / 8;
    } else {
      return game.width / 4;
    };
  };
  color() {
    if ((this.r + this.pulseCount) > this.r * 2.8) {
      return 2;
    } else if ((this.r + this.pulseCount) > this.r * 2) {
      return 1;
    } else {
      return 0;
    }
  };
  click(playerInput = true) {
    cookie.clicked++;
    utility.money += cookie.worth;
    utility.earned += cookie.worth;
    player.totalEarnings += cookie.worth;
    if (utility.rolling && playerInput) {
      utility.time = utility.rollTime; // start rolling time
      if (utility.round(utility.clickCount) < utility.round(utility.maxClickCount)) utility.clickCount += utility.round(0.01); // increase if less than max rolling bonus
    };
    if (utility.inFrenzy) { // check if frenzy time should increase
      if (utility.frenzyLeft < utility.frenzyMax - 1.5) {
        utility.frenzyLeft += 1.5;
      };
    };
    if (cookie.r + cookie.pulseCount < cookie.pulseLimit) { // if cookie should expand
      cookie.pulseCount += cookie.pulse;
    } else cookie.reset();
    container.fill();
    clickEffect.push(new Effects(utility.convert(cookie.worth), true));
  };
  reset() {
    if (utility.explodable) {
      cookie.pulseCount = 0;
      cookie.exploded++;
      cookie.exploding = true;
      cookie.explode = cookie.explodeFor;
      for (var i = 0; i < 25; i++) {
        if (explodingCookie.length < 150) explodingCookie.push(new Cookie);
      };
      if (utility.inFrenzy) {
        utility.money += 5 * cookie.bonusWorth;
        utility.earned += 5 * cookie.bonusWorth;
        player.totalEarnings += 5 * cookie.bonusWorth;
        clickEffect.push(new Effects(utility.convert(5 * cookie.bonusWorth), true, 1.75));
      } else {
        utility.money += cookie.bonusWorth;
        utility.earned += cookie.bonusWorth;
        player.totalEarnings += cookie.bonusWorth;
        clickEffect.push(new Effects(utility.convert(cookie.bonusWorth), true, 1.5));
      }
    };
  };
  boom(which, color) {
    // draw new cookies
    explodingCookie.forEach(
      function(c) {
      which.draw(c.x + (c.r / 3), c.xV, c.y + (c.r / 3), c.yV, c.r / 2, c.pulseCount, color, 0);
      // move cookies in random direction
      c.xV += c.dX * 30;
      c.yV += c.dY * 30;
    });
    if (this.explode > 0) { // turn off the explode
      this.explode--;
    }
    if (this.explode <= 0) {
      this.exploding = false;
      explodingCookie = [];
    }
  };
  goldReset() {
    utility.money += this.goldWorth;
    utility.earned += this.goldWorth;
    player.totalEarnings += this.goldWorth;
    cookie.goldCookieClicked++;
    goldCookie.gold = false;
    goldCookie.exploding = true;
    goldCookie.explode = goldCookie.explodeFor;
    for (var i = 0; i < 75; i++) {
      explodingCookie.push(new Cookie);
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
    // explode cookie
    if (cookie.exploding) {
      cookie.boom(cookie, 2);
      explodingCookie.forEach(function(c) {
        if (c.x + c.xV < (-game.width * 2) || c.x + c.xV > (game.width * 2)) explodingCookie.splice(0,1);
        if (c.y + c.yV < (-game.height * 2) || c.y + c.yV > (game.height * 2)) explodingCookie.splice(0,1);
      });
    };
    if (goldCookie.goldCount < 0) { // if the gold cookie should disappear
      goldCookie.gold = false;
    };
    if (goldCookie.exploding) {
      goldCookie.boom(goldCookie, 3);
    };
    //  check if golden cookie should spawn
    if (utility.goldable && !utility.upgrading && goldCookie.explode <= 0 && !goldCookie.gold && Math.random() > 0.999) {
      goldCookie = new Cookie();
      goldCookie.goldCount = 100;
      goldCookie.gold = true;
    };
  };
};

class Container {
  constructor(index) {
    this.column = index;
    this.row = 7;
    this.level = utility.level[index];
    this.x = 15;
    this.y = game.height - game.textSize - (2 * game.frameW);
    this.type = ["", "Jar", "Basket", "Box", "Pallet", "Factory"];
    this.filled = 0;
    this.filling = 0;
    this.full = false;
    this.sold = utility.parseFromLocalStorage("playerContainersSold", 0);
    this.sin = 0;
    this.sinSwitch = false;
    this.increasing = false;
    this.selling = false;
    this.setUgrades();
  };
  setUgrades() {
    this.level = utility.level[CONTAINER_LEVEL[0]];
    this.column = this.level;
    this.cap = Math.pow(8, utility.level[CONTAINER_LEVEL[0]]);
    this.reducedCap = this.cap * (utility.level[CONTAINER_SIZE[0]] / (CONTAINER_SIZE[5] + 1));
    this.capacity = Math.floor(this.cap - this.reducedCap);
    this.worth = utility.multiply(cookie.worth * ((this.level + utility.level[CONTAINER_PRICE[0]]) * 8));
  };
  draw() {
    ctxD.globalAlpha = "0.3";
    ctxD.drawImage( // the container image
      texture, // the texture sheet
      (this.column - 1) * game.frameW, this.row * game.frameH, // starting x + y
      game.frameW, game.frameH, // width + height
      (game.width / 2) - game.frameW, this.y, // destination x + y
      2 * game.frameW, 2 * game.frameH // drawn width + height
    );
    if (this.full) ctxD.globalAlpha = this.sin;
    else ctxD.globalAlpha = "1";
    ctxD.drawImage( // the overlay container image
      texture, // the texture sheet
      (this.column - 1) * game.frameW, // starting x
      this.row * game.frameH, // starting y
      game.frameW, // width
      game.frameH  * (this.filling / this.capacity), // height
      (game.width / 2) - game.frameW, // destination x
      this.y, // destination y
      2 * game.frameW, // drawn width
      2 * game.frameH  * (this.filling / this.capacity) // drawn height
    );
    // the container text
    ctxD.globalAlpha = "1";
    ctxD.fillStyle = "black";
    ctxD.textAlign = "center";
    ctxD.textBaseline = "bottom";
    ctxD.font = (game.textSize / 1.5) + "px calibri";
    // draw the name and capacity of the container
    ctxD.fillText(this.type[this.level] + ": " + this.filled + "/" + this.capacity, game.width / 2, this.y);
    if (this.filled != this.filling) {
      if (this.filled > this.filling) this.filling++;
      else this.filling--;
    };
  };
  fill() {
    if (utility.level[CONTAINER_LEVEL[0]] > 0 && this.filled < this.capacity) {
      this.filled++;
    }
  };
  sell() {
    if (this.full) {
      clickEffect.push(new Effects(utility.convert(container.worth), true, 1.5));
      utility.money += this.worth;
      utility.earned += this.worth;
      player.totalEarnings += this.worth;
      this.filled = 0;
      this.full = false;
      this.sold++;
    };
  };
  update() {
    container.setUgrades();
    if (this.filled >= this.capacity) {
      this.full = true;
    };
    if (utility.level[CONTAINER_AUTOSELL[0]] > 0) {
      if (this.full) this.sell();
    } else {
      if (this.sinSwitch) {
        this.sin -= 0.025;
      } else {
        this.sin += 0.025;
      }
      if (this.sin > 0.99) this.sinSwitch = true;
      if (this.sin < 0.01) this.sinSwitch = false;
    };
  };
};

class Effects {
  constructor(text, type, size = 1) {
    this.text = text;
    this.x = 2 * game.width;
    this.y = 1.5 * game.textSize;
    this.font = size * game.textSize;
    this.type = type;
    this.time = 0;
    this.hue = 0;
  };
};

class Button {
  constructor(btn, order) {
      //btn[index, texture row, description, base cost, cost factor, max level, one time purchase?, requirement]
    this.width = game.frameW;
    this.height = game.frameH;
    this.index = btn[0];
    this.row = btn[1];
    this.description = btn[2];
    this.baseCost = btn[3];
    this.costFactor = btn[4];
    this.maxLevel = btn[5];
    this.oneTimePurchase = btn[6];
    this.requirement = btn[7];
    this.x = game.textSize;
    this.size = game.frameW;
    this.length = game.frameH;
    this.y = (1.2 * this.size * order) + (3.5 * game.textSize);
    this.level;
    this.price;
  };
  drawButton() {
    this.level = utility.level[this.index];
    this.price = utility.cost[this.index];
    ctxD.imageSmoothingEnabled = true;
    ctxD.imageSmoothingQuality = "high";
    let newRow = this.row;
    if (this.price <= utility.money && utility.purchasable(this.index, this.requirement)) { // the button background
      ctxD.fillStyle = "hsl(105, 100%, 50%)";
    } else {
      ctxD.fillStyle = "lightgrey";
      newRow = this.row - 1;
    };
    ctxD.fillRect(this.x, this.y - input.dY, this.length, this.size);
      //game.width - (2 * game.textSize), this.size);
    ctxD.drawImage(
      texture, // the texture sheet
      this.index * game.frameW, newRow * game.frameH, // texture x and y
      game.frameW, game.frameH, // width and height
      this.x, this.y - input.dY, // destination x and y
      this.size, this.size // drawn width and height
    );
    ctxD.fillStyle = "black";
    ctxD.textAlign = "right";
    ctxD.textBaseline = "middle";
    ctxD.font = (0.65 * game.textSize) + "px calibri";
    ctxD.fillText(this.level, (this.x * 0.9), (this.y + (this.size / 2)) - input.dY); // the button level
    ctxD.textAlign = "left";
    ctxD.font = (game.textSize * 0.5) + "px calibri";
    ctxD.fillText("$" + utility.convert(this.price), this.x + this.size, (this.y + (this.size / 4)) - input.dY); // the button price
    ctxD.font = (game.textSize * 0.4) + "px calibri";
    ctxD.fillText(this.description, this.x + this.size, this.y + (3 * this.size / 4) - input.dY); // the button description
  };
};

let game = new Game;
let input = new InputHandler;
const SHOP_BUTTONS = [
  new Button(MONEY_PER_CLICK, 0),
  new Button(COOKIE_EXPLODE, 1),
  new Button(EXPLODE_BONUS, 3),
  new Button(EXPLODE_QUICKER, 2),
  new Button(ROLLING_MULTIPLIER, 10),
  new Button(ROLLING_DURATION, 11),
  new Button(ROLLING_BONUS, 12),
  new Button(OVERALL_MULTIPLIER, 15),
  new Button(AUTOCLICKERS, 9),
  new Button(GOLDEN_COOKIE, 16),
  new Button(CONTAINER_LEVEL, 6),
  new Button(CONTAINER_SIZE, 7),
  new Button(CONTAINER_PRICE, 8),
  new Button(CONTAINER_AUTOCLICK, 13),
  new Button(CONTAINER_AUTOSELL, 14),
  new Button(EXPLODE_FRENZY, 17),
  new Button(PULSE_SLOW, 4),
  new Button(PULSE_LIMIT, 5)
];
let utility = new Utility;
let cookie = new Cookie;
let goldCookie = new Cookie;
let player = new Player;
let container = new Container(CONTAINER_LEVEL[0]);

let PLAYER_STATS = [];
player.updateStats();

then = Date.now();
game.loop();
