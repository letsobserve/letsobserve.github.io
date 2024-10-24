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

// 0 = increase money per click, 1 = cookie explodable
// 2 = increase bonus money, 3 = less clicks to explode
// 4 = rolling multiplier, 5 = increase rolling duration
// 6 = increase rolling max, 7 = overall multiplier,
// 8 = auto click, 9 = unlock golden cookies
// 10 = level up container, 11 = less cookies to fill container
// 12 = increase container worth, 13 = auto clicks pack containers
// 14 = auto sell containers, 15 = unlock cookie explode frenzy
// game constants
const NUMBER_OF_UPGRADES = 16;
const MONEY_PER_CLICK = 0;
const COOKIE_EXPLODE = 1;
const EXPLODE_BONUS = 2;
const EXPLODE_QUICKER = 3;
const CONTAINER_LEVEL = 10;
const CONTAINER_SIZE = 11;
const CONTAINER_PRICE =12;
const CONTAINER_AUTOCLICK = 13;
const CONTAINER_AUTOSELL = 14;
const ROLLING_MULTIPLIER = 4;
const ROLLING_DURATION = 5;
const ROLLING_BONUS = 6;
const OVERALL_MULTIPLIER = 7;
const AUTOCLICKERS = 8;
const GOLDEN_COOKIE = 9;
const EXPLODE_FRENZY = 15;

let lastTime = 0;
let now = new Date();
let time = now.getTime();
let expireTime = time + (365 * 24 * 60 * 60);
let latestTime, then, elapsed, timer, touchEvent;
let clickEffect = [];
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
    ctxS.fillStyle = "white"; // play button color
    ctxS.fillRect((game.width / 2) - (game.width / 4), game.height / 2, game.width / 2, 4 * game.textSize); // start play button
    ctxS.fillStyle = "black"; // game title color
    ctxS.textAlign = "center"; // game title alignment
    ctxS.textBaseline = "middle"; // game title alignment
    ctxS.font = "small-caps bolder " + 2 * this.textSize + "px calibri"; // game title
    ctxS.fillText("Cookie", game.width / 2, (game.height / 4) - cookie.r); // game title
    ctxS.fillText("Frenzy", game.width / 2, (game.height / 4) + cookie.r); // game title
    ctxS.textAlign = "middle";
    ctxS.textBaseline = "top";
    ctxS.font = this.textSize + "px calibri";
    ctxS.fillText("Play", game.width / 2, game.height / 1.95);
    ctxS.fillText("Exit", game.width / 2, (game.height / 1.95) + 2 * game.textSize);
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
      ctxD.textBaseline = "top";
      ctxD.font = this.textSize / 1.5 + "px calibri";
      ctxD.globalAlpha = 0.5;
      ctxD.fillText("Shop", this.width / 2, 1.15*this.textSize);
      ctxD.textAlign = "right";
      ctxD.fillText("Prestige", this.width - 10, 1.15*this.textSize);
      ctxD.textAlign = "left";
      ctxD.fillText("Menu", 10, 1.15*this.textSize);
      ctxD.globalAlpha = 1;
      if (game.state == 2) { // shop screen
        ctxD.textAlign = "center";
        ctxD.fillText("Shop", this.width / 2, 1.15*this.textSize);
      };
      if (game.state == 3) { // prestige screen
        ctxD.textAlign = "right";
        ctxD.fillText("Prestige", this.width - 10, 1.15*this.textSize);
      };
      if (game.state == 4) { // menu screen
        ctxD.textAlign = "left";
        ctxD.fillText("Menu", 10, 1.15*this.textSize);
      };
      ctxD.textAlign = "left";
      ctxD.textBaseline = "top";
      ctxD.font = game.textSize + "px calibri";
      ctxD.fillText("$" + utility.round(utility.money), 5, 5); // draw money
      ctxD.font = game.textSize / 2 + "px calibri";
      ctxD.textAlign = "right";
      ctxD.fillText(utility.convert(player.EPS) + " $/s", game.width - 5, 0.25*game.textSize); // draw the money per second
      for (let i = 0; i < clickEffect.length; i++) { // draw the earned money
        ctxD.textAlign = "center";
        ctxD.textBaseline = "middle";
        if (clickEffect[i].time > 0) {
          ctxD.font = (clickEffect[i].font * clickEffect[i].time) + "px calibri";
          ctxD.globalAlpha = clickEffect[i].time;
          if (clickEffect[i].type) { // show earn money or lose money
            ctxD.fillStyle = "green";
            ctxD.fillText("+$" + clickEffect[i].text, clickEffect[i].x  / clickEffect[i].time, clickEffect[i].y);
          } else {
            ctxD.fillStyle = "red";
            ctxD.fillText("-$" + clickEffect[i].text, clickEffect[i].x / clickEffect[i].time, clickEffect[i].y);
          };
          clickEffect[i].time -= 0.01;
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
    if (utility.level[CONTAINER_LEVEL] > 0) container.update();
    if (game.state == 2) btn1.update();
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
      if (!lastTime || now - lastTime >= ((1000 - utility.tapRate) / (utility.level[AUTOCLICKERS] / 5))) { // auto click occasionally
        lastTime = now;
        cookie.click();
        if (utility.level[CONTAINER_AUTOCLICK] > 0) container.fill();
      };
      if (game.state == 0) { // draw the start menu
        game.drawStartScreen();
      } else if (game.state == 1) { // draw the cookie screen
        game.drawBackground();
        utility.drawD();
        // draw the cookie
        cookie.draw(cookie.x, cookie.xV, cookie.y, cookie.yV, cookie.r, cookie.pulseCount, cookie.color(), 0);
        if (goldCookie.gold && !utility.upgrading) { // draw golden cookie
          goldCookie.draw(goldCookie.rX, 0, goldCookie.rY, 0, goldCookie.rR, 0, 3, 0);
          goldCookie.goldCount--;
        };
        if (utility.level[CONTAINER_LEVEL] > 0) container.draw();
        if (player.returning) { // display when player returns
          player.returns();
        };
      } else if (game.state == 2) { // draw the shop screen
        game.drawBackground();
        utility.drawShop();
      } else if (game.state == 3) { // draw the prestige screen
        game.drawBackground();
        utility.drawP();
      } else { // draw the menu screen
        utility.drawD();
        game.drawBackground();
        utility.drawT();
      };
      game.drawMenu();
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
      // reset the values
      //xDown = null;
      //yDown = null;
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
      if (x > 2 * game.frameW && x < (2 * game.frameW) + (4 * game.frameW) && y > game.height / 2 && y < (game.height / 2) + (1.5 * game.frameW)) { // play button
        game.state = 1;
      } else if (x > 2 * game.frameW && x < (2 * game.frameW) + (4 * game.frameW) && y > game.height / 1.5 && y < (game.height / 1.5) + (1.5 * game.frameW)) { // exit button
        window.history.go(-1);
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
      if (x > btn1.x && x < (btn1.x + btn1.length) && y > 2.5 * game.textSize) { // check if in upgrade button area
        // check each button
        if (y > btn1.y - input.dY && y < btn1.y + btn1.size - input.dY) {
          utility.upgrade(MONEY_PER_CLICK);
        };
        if (y > btn2.y - input.dY && y < btn2.y + btn2.size - input.dY) {
          utility.upgrade(COOKIE_EXPLODE);
        };
        if (y > btn3.y - input.dY && y < btn3.y + btn3.size - input.dY) {
          utility.upgrade(EXPLODE_BONUS);
        };
        if (y > btn4.y - input.dY && y < btn4.y + btn4.size - input.dY) {
          utility.upgrade(EXPLODE_QUICKER);
        };
        if (y > btn5.y - input.dY && y < btn5.y + btn5.size - input.dY) {
          utility.upgrade(CONTAINER_LEVEL);
        };
        if (y > btn6.y - input.dY && y < btn6.y + btn6.size - input.dY) {
          utility.upgrade(CONTAINER_SIZE);
        };
        if (y > btn7.y - input.dY && y < btn7.y + btn7.size - input.dY) {
          utility.upgrade(CONTAINER_PRICE);
        };
        if (y > btn8.y - input.dY && y < btn8.y + btn8.size - input.dY) {
          utility.upgrade(CONTAINER_AUTOCLICK);
        };
        if (y > btn9.y - input.dY && y < btn9.y + btn9.size - input.dY) {
          utility.upgrade(CONTAINER_AUTOSELL);
        };
        if (y > btn10.y - input.dY && y < btn10.y + btn10.size - input.dY) {
          utility.upgrade(ROLLING_MULTIPLIER);
        };
        if (y > btn11.y - input.dY && y < btn11.y + btn11.size - input.dY) {
          utility.upgrade(ROLLING_DURATION);
        };
        if (y > btn12.y - input.dY && y < btn12.y + btn12.size - input.dY) {
          utility.upgrade(ROLLING_BONUS);
        };
        if (y > btn13.y - input.dY && y < btn13.y + btn13.size - input.dY) {
          utility.upgrade(OVERALL_MULTIPLIER);
        };
        if (y > btn14.y - input.dY && y < btn14.y + btn14.size - input.dY) {
          utility.upgrade(AUTOCLICKERS);
        };
        if (y > btn15.y - input.dY && y < btn15.y + btn15.size - input.dY) {
          utility.upgrade(GOLDEN_COOKIE);
        };
        if (y > btn16.y - input.dY && y < btn16.y + btn16.size - input.dY) {
          utility.upgrade(EXPLODE_FRENZY);
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
          utility.setPrestige();
        };
        if (x > (game.width / 2) + (game.textSize) && x < (game.width / 2) + (2 * game.textSize)) {
          utility.prestigeConfirm = false;
          utility.prestigeScreen = false;
        };
      };
    };

    if (x > game.width / 3 && x < game.width - (game.width / 3) && y < 2 * game.textSize) { // shop button clicked
      if (game.state == 2) game.state = 1;
      else game.state = 2;
    };
    if (x > game.width - (game.width / 3) && y < 2 * game.textSize) { //  prestige button clicked
      if (game.state == 3) game.state = 1;
      else game.state = 3;
    };
    if (x < game.width / 3 && y < 2 * game.textSize) { // menu button clicked
      if (game.state == 4) game.state = 1;
      else game.state = 4;
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
    this.returnWorth = Math.ceil(utility.level[MONEY_PER_CLICK] * this.lastPlaySeconds);
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
    if (localStorage.getItem("playerBestEPS") < player.EPS) {
      localStorage.setItem("playerBestEPS", player.EPS);
      this.lastEPS = player.EPS;
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
    this.clickCount = 0; // current click count
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
  drawD() { // draw the dynamic cookie screen
    ctxD.textAlign = "center";
    ctxD.fillStyle = "black";
    ctxD.textAlign = "left";
    ctxD.textBaseline = "top";
    ctxD.font = game.textSize + "px calibri";

    if (utility.rolling) { // draw the rolling multiplier
      // bounding ellipse
      ctxD.fillStyle = "white";
      ctxD.strokeStyle = "black";
      ctxD.fillRect(
        game.width - (2 * game.textSize) + 25, 2 * game.textSize + 10, // x & y
        2 * game.textSize - 40, game.textSize, // width & height
      );
      // slow filling timer
      if (this.clickCount > 0) {
        ctxD.globalAlpha = ((this.time - input.lastClick) / this.rollTime);
        ctxD.fillStyle = "rgb(255,0,0)";
        ctxD.fillRect(
          game.width - 15, 2 * game.textSize + 10, // x & y
          -(utility.time / utility.rollTime) * (2 * game.textSize - 40), game.textSize, // width & height
        );
      };
      // counter
      ctxD.globalAlpha = 1;
      ctxD.fillStyle = "black";
      ctxD.strokeStyle = "darkgrey";
      ctxD.textAlign = "left";
      ctxD.textBaseline = "middle";
      ctxD.font = (game.textSize / 2) + "px calibri";
      ctxD.lineWidth = 8;
      ctxD.strokeText("x " + utility.clickCount, game.width - (1.5 * game.textSize), 2.5 * game.textSize + 5);
      ctxD.lineWidth = 5;
      ctxD.fillText("x " + utility.clickCount, game.width - (1.5 * game.textSize), 2.5 * game.textSize + 5);
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

    btn1.drawButton();
    btn2.drawButton();
    btn3.drawButton();
    btn4.drawButton();
    btn5.drawButton();
    btn6.drawButton();
    btn7.drawButton();
    btn8.drawButton();
    btn9.drawButton();
    btn10.drawButton();
    btn11.drawButton();
    btn12.drawButton();
    btn13.drawButton();
    btn14.drawButton();
    btn15.drawButton();
    btn16.drawButton();
    utility.drawCloseBtn("Shop");
  };
  drawP() { // draw the dynamic prestige screen
    ctxD.fillStyle = "black";
    ctxD.textAlign = "center";
    ctxD.textBaseline = "top";
    ctxD.font = game.textSize + "px calibri";
    ctxD.lineWidth = 10;
    ctxD.fillText("Total Earnings", game.width / 2, 2.25 * game.textSize);
    ctxD.font = game.textSize / 1.25 + "px calibri";
    ctxD.fillText(utility.convert(utility.earned), game.width / 2, 3.35 * game.textSize);
    ctxD.font = game.textSize / 2 + "px calibri";
    ctxD.textAlign = "left";
    ctxD.fillText("You have:", game.frameW, 4.35 * game.textSize);
    ctxD.textAlign = "right";
    ctxD.fillText(utility.convert(utility.prestige) + "  currency", game.width - game.frameW, 4.35 * game.textSize); // how much prestige the player currently has
    ctxD.textAlign = "center";
    ctxD.fillText("increasing your earnings by:", game.width / 2, 4.85 * game.textSize);
    ctxD.fillText(utility.convert(utility.prestigeBonus) + " x", game.width / 2, 5.5 * game.textSize); // calculate how much the prestige amplifies profits
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
    utility.drawCloseBtn("Prestige");
  };
  drawT() { // draw the dynamic menu screen
    ctxD.fillStyle = "black";
    ctxD.textBaseline = "top";
    ctxD.textAlign = "left";
    ctxD.font = game.textSize / 2 + "px calibri";
    ctxD.fillText("Lifetime Earnings:" , 5, 3 * game.textSize - input.dY);
    ctxD.fillText("Highest Earnings per second:", 5, 5 * game.textSize - input.dY);
    ctxD.fillText("Clicked Cookie:", 5, 7 * game.textSize - input.dY);
    ctxD.fillText("Cookie Exploded:", 5, 9 * game.textSize - input.dY);
    ctxD.fillText("Containers sold:", 5, 11 * game.textSize - input.dY);
    ctxD.fillText("Golden Cookies Clicked:", 5, 13 * game.textSize - input.dY);
    ctxD.fillText("Upgrades Purchased:", 5, 15 * game.textSize - input.dY);
    ctxD.fillText("Money Spent:", 5, 17 * game.textSize - input.dY);
    ctxD.fillText("Prestiges:", 5, 19 * game.textSize - input.dY);
    ctxD.textAlign = "right";
    ctxD.fillText(utility.convert(player.totalEarnings), game.width - 5, 3.5 * game.textSize - input.dY);
    ctxD.fillText(utility.convert(player.lastEPS), game.width - 5, 5.5 * game.textSize - input.dY);
    ctxD.fillText(utility.convert(cookie.clicked), game.width - 5, 7.5 * game.textSize - input.dY);
    ctxD.fillText(utility.convert(cookie.exploded), game.width - 5, 9.5 * game.textSize - input.dY);
    ctxD.fillText(utility.convert(container.sold), game.width - 5, 11.5 * game.textSize - input.dY);
    ctxD.fillText(utility.convert(cookie.goldCookieClicked), game.width - 5, 13.5 * game.textSize - input.dY);
    ctxD.fillText(utility.convert(utility.purchased), game.width - 5, 15.5 * game.textSize - input.dY);
    ctxD.fillText(utility.convert(player.spent), game.width - 5, 17.5 * game.textSize - input.dY);
    ctxD.fillText(utility.convert(player.prestiges), game.width - 5, 19.5 * game.textSize - input.dY);
    utility.drawCloseBtn("Menu");
  };
  drawCloseBtn(screen) {
    ctxD.lineWidth = 10;
    ctxD.textAlign = "center";
    ctxD.textBaseline = "top";
    ctxD.fillStyle = "white";
    ctxD.fillRect(0, game.height - game.textSize, game.width, game.textSize);
    ctxD.globalAlpha = 0.45;
    ctxD.fillStyle = "red";
    ctxD.fillRect(0, game.height - game.textSize, game.width, game.textSize);
    ctxD.globalAlpha = 1;
    ctxD.fillStyle = "black";
    ctxD.strokeStyle = "black";
    ctxD.font = game.textSize + "px calibri";
    ctxD.fillText("Close " + screen, game.width / 2, game.height - game.textSize);
    ctxD.strokeRect(0, game.height - game.textSize, game.width, game.height);
  };
  setUgrades() {
    try { // get the player details
      this.getLevel = localStorage.getItem("playerUpgrades").split(",");
      for (let i = 0; i < NUMBER_OF_UPGRADES; i++) {
        this.level.push(parseInt(this.getLevel[i]));
      };
    } catch { // set new player
      for (let i = 0; i < NUMBER_OF_UPGRADES; i++) {
        this.level.push(0);
      };
    };
    this.costFactor = [1.5, 1, 1.55, 2, 1, 2.5, 5, 10.5, 1.9, 1, 20, 2.22, 2, 1, 1, 1];
    this.baseCost = [20, 250, 600, 1000, 7500, 10500, 12000, 50000, 5000, 5000000, 1500, 5000, 10000, 100000, 50000, 10000000];
    this.cost = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (let i = 0; i < NUMBER_OF_UPGRADES; i++) {
      this.cost[i] = this.baseCost[i] * ((1 + this.level[i]) * this.costFactor[i]);
    }
    // this.cost = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]; // testing purposes

    if (this.level[COOKIE_EXPLODE] > 0) this.explodable = true;
    else this.explodable = false;
    if (this.level[ROLLING_MULTIPLIER] > 0) this.rolling = true;
    else this.rolling = false;
    this.rollTime = 30 * (1 + this.level[ROLLING_DURATION])
    if (this.level[GOLDEN_COOKIE] > 0) this.goldable = true;
    else this.goldable = false;
    this.maxClickCount = 5 + (this.level[ROLLING_BONUS] * 5);
    this.multiplier = 1 + this.level[OVERALL_MULTIPLIER];
    if (this.level[AUTOCLICKERS] > 0) this.autoTap = true;
    else this.autoTap = false;
    this.tapRate = 0; // future prestige talent
    if (this.level[EXPLODE_FRENZY] > 0) this.frenzy = true;
    else this.frenzy = false;
  };
  multiply(number) {
    return Math.round(
      (((number + Number.EPSILON) * (1 + utility.clickCount)) * utility.multiplier) * utility.prestigeBonus
     * 100) / 100;
  };
  round(number) {
    return Math.round((number + Number.EPSILON) * 100) / 100;
  };
  purchasable(index, requirement) { // check if upgrade purchasable
    let returnValue;
    if (utility.level[requirement] > 0) returnValue = true;
    if (requirement == -1) returnValue = true;
    if (utility.oneTimePurchase(index) && utility.level[index] > 0) returnValue = false;
    return returnValue;
  };
  oneTimePurchase(index) {
    if (index == (COOKIE_EXPLODE || CONTAINER_AUTOCLICK || CONTAINER_AUTOSELL || ROLLING_MULTIPLIER || GOLDEN_COOKIE || EXPLODE_FRENZY)) return true;
    return false;
  };
  upgrade(index) {

    if (utility.money < utility.cost[index]) return;
    if (utility.oneTimePurchase(index) && utility.level[index] > 0) return;
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
    if (number > 1000000) {
      var arr = [];
      var str = number.toPrecision(6);
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
      for (var x = intermediate; x < (intermediate + 3); x++) {
        arr.push(splitString[x]);
      };
      var result = arr.join("");
      var final = result + " " + utility.units()[unit];
      return final;
    } else {
      return utility.round(number);
    };
  };
  resetScroll (top, bottom) {
    if (top - input.dY > top) { // keep first button from scrolling too far
      input.dY += 2;
      if (top - input.dY > (1.15 * top)) {
        input.dY += 10;
      };
      if (top - input.dY > (4 * top)) {
        input.dY += 50;
      };
    };
    if (bottom - input.dY < (game.height - (2.3 * game.textSize))) { // keep last button from scrolling too far
      input.dY -= 2;
      if (bottom - input.dY < (game.height - (2.5 * game.textSize))) {
        input.dY -= 10;
      };
      if (bottom - input.dY < (game.height - (6 * game.textSize))) {
        input.dY -= 50;
      };
    };
  };
  setPrestige() { // prestige sequence
    this.prestige += this.prestigeFor;
    player.prestiges++;
    this.money = 0;
    this.level = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.cost = [20, 250, 600, 900, 5000, 5500, 6200, 15000, 5000, 50000, 1500, 5000, 10000, 100000, 5000, 100000];
    this.earned = 0;
    cookie.pulse = 25;
    player.earnedThen = 0;
    player.earnedNow = 0;
    player.update();
    utility = new Utility;
    cookie.gold = false;
    game.state = 1;
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
    } else utility.clickCount = 0;
    if (utility.prestigeScreen) utility.prestigeConfirm = true;
    if (game.state == 4) utility.resetScroll(3 * game.textSize, 19 * game.textSize);
  };
};

class Cookie {
  constructor() {
    this.x = game.width / 2;
    this.y = game.height / 2;
    this.r = this.radius();
    this.pulseCount = 0;
    this.setUgrades();
    this.clicked = parseInt(localStorage.getItem("playerCookieClicked"));
    if (!Number.isInteger(this.clicked)) {
      this.clicked = 0;
    };
    this.exploded = parseInt(localStorage.getItem("playerCookieExploded"));
    if (!Number.isInteger(this.exploded)) {
      this.exploded = 0;
    };
    this.goldCookieClicked = parseInt(localStorage.getItem("playerGoldCookieClicked"));
    if (!Number.isInteger(this.goldCookieClicked)) {
      this.goldCookieClicked = 0;
    };
    this.expCookie = [];
    this.exploding = false;
    this.explode = 0;
    this.explodeFor = 150;
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
    this.pulse = 25 + (utility.level[EXPLODE_QUICKER] * 5);
    this.worth = utility.multiply(1 + (utility.level[MONEY_PER_CLICK] / 2));
    this.bonusWorth = utility.multiply(1 + (utility.level[EXPLODE_BONUS] / 2) * this.worth);
    this.goldWorth = this.bonusWorth;
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
  click() {
    cookie.clicked++;
    utility.money += cookie.worth;
    utility.earned += cookie.worth;
    player.totalEarnings += cookie.worth;
    if (utility.rolling) {
      utility.time = utility.rollTime; // start rolling time
      if (utility.clickCount < utility.maxClickCount) utility.clickCount++; // increase if less than max rolling bonus
    };
    if (utility.inFrenzy) { // check if frenzy time should increase
      if (utility.frenzyLeft < utility.frenzyMax - 1) {
        utility.frenzyLeft++;
      };
    };
    if (cookie.r + cookie.pulseCount < cookie.r * 3) { // if cookie should expand
      cookie.pulseCount += cookie.pulse;
      container.fill();
    } else {
      cookie.reset();
      container.fill();
    };
    clickEffect.push(new Effects(utility.convert(cookie.worth), true));
  };
  reset() {
    if (utility.explodable) {
      cookie.pulseCount = cookie.pulse;
      utility.money += cookie.bonusWorth;
      utility.earned += cookie.bonusWorth;
      player.totalEarnings += cookie.bonusWorth;
      cookie.exploded++;
      //utility.explode();
      cookie.exploding = true;
      cookie.explode = cookie.explodeFor;
      clickEffect.push(new Effects(utility.convert(cookie.bonusWorth), true, 1.5));
      for (var i = 0; i < 25; i++) {
        if (cookie.expCookie.length < 500) cookie.expCookie.push(new Cookie);
      };
      if (utility.inFrenzy) {
        cookie.frenzy();
      };
    } else {
      utility.money += cookie.worth;
      utility.earned += cookie.worth;
    };
  };
  boom(which, color) {
    // draw new cookies
    this.expCookie.forEach(function(c) {
      which.draw(c.x + (c.r / 3), c.xV, c.y + (c.r / 3), c.yV, c.r / 2, c.pulseCount, color, 0);
      // move cookies in random direction
      c.xV += c.dX * 30;
      c.yV += c.dY * 30;
    });
    if (this.explode > 0) { // turn off the explode
      this.explode--;
    }
    if (this.explode == 0) {
      this.exploding = false;
      this.expCookie = [];
    }
  };
  frenzy() {
    utility.money += 5 * cookie.bonusWorth;
    utility.earned += 5 * cookie.bonusWorth;
    player.totalEarnings += 5 * cookie.bonusWorth;
  };
  goldReset() {
    cookie.reset();
    utility.money += this.goldWorth;
    utility.earned += this.goldWorth;
    player.totalEarnings += this.goldWorth;
    cookie.goldCookieClicked++;
    goldCookie.gold = false;
    goldCookie.exploding = true;
    goldCookie.explode = goldCookie.explodeFor;
    for (var i = 0; i < 100; i++) {
      goldCookie.expCookie[i] = new Cookie;
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
      cookie.pulseCount--;
      // cookie deflates faster after 1.5 seconds
      if (latestTime > input.lastClick + (1500)) cookie.pulseCount -= 2;
    };
    // explode cookie
    if (cookie.exploding) {
      cookie.boom(cookie, 2);
      this.expCookie.forEach(function(c) {
        if (c.x + c.xV < (-game.width * 4) || c.x + c.xV > (game.width * 4)) cookie.expCookie.splice(0,1);
        if (c.y + c.yV < (-game.height * 4) || c.y + c.yV > (game.height * 4)) cookie.expCookie.splice(0,1);
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
    this.x = 15; // x position of container area
    this.y = game.height - game.textSize - 10; // y position of container area
    this.type = ["None", "Jar", "Box", "Basket", "Sack", "Pallet", "Container"];
    this.reduceCap;
    this.capacity;
    this.bonus;
    this.worth;
    this.filled = 0;
    this.filling = 0;
    this.full = false;
    this.sold = parseInt(localStorage.getItem("playerContainersSold"));
    if (!Number.isInteger(this.sold)) this.sold = 0;
    this.sin = 0;
    this.sinSwitch = false;
    this.increasing = false;
    this.selling = false;
  };
  setUgrades() {
    this.level = utility.level[CONTAINER_LEVEL];
    this.column = this.level;
    this.reduceCap = utility.level[CONTAINER_SIZE];
    this.capacity = (utility.level[CONTAINER_LEVEL] * 15) - this.reduceCap;
    this.bonus = utility.multiply(1 + (utility.level[CONTAINER_PRICE] * 5));
    this.worth = utility.multiply(cookie.worth * ((utility.level[CONTAINER_LEVEL] * 15) + this.bonus));
  };
  draw() {
    if (this.full) {
      ctxD.globalAlpha = this.sin;
      ctxD.fillStyle = "white";
      ctxD.fillRect(this.x - 15, this.y - 15, game.width, game.textSize + 30);
      ctxD.globalAlpha = "1";
    };
    if (utility.level[CONTAINER_LEVEL] > 0) {
      ctxD.fillStyle = "white";
      ctxD.fillRect(this.x, this.y, game.width - (2 * this.x), game.textSize);
      if (this.filled != this.filling) {
        if (this.filled > this.filling) {
          this.filling++;
        } else {
          this.filling--;
        };
      };
      ctxD.fillStyle = "green";
      ctxD.fillRect(this.x, this.y, (this.filling / this.capacity) * (game.width - (2 * this.x)), game.textSize);
    };
    ctxD.drawImage( // the container image
      texture, // the texture sheet
      (this.column - 1) * game.frameW, // starting x
      this.row * game.frameH, // starting y
      game.frameW, // width
      game.frameH, // height
      (game.width / 2) - (game.frameW / 2), // destination x
      this.y - 5, // destination y
      0.9 * game.frameW, // drawn width
      0.9 * game.frameH // drawn height
    );
    // the container text
    ctxD.fillStyle = "black";
    ctxD.strokeStyle = "white";
    ctxD.textAlign = "left";
    ctxD.textBaseline = "top";
    ctxD.font = game.textSize + "px calibri";
    // draw the name of the container
    ctxD.strokeText(this.type[this.level], this.x + 10, this.y);
    ctxD.fillText(this.type[this.level], this.x + 10, this.y);
    // draw the capacity of the container
    ctxD.textAlign = "right";
    ctxD.strokeText(this.filled + "/" + this.capacity, game.width - 30, this.y);
    ctxD.fillText(this.filled + "/" + this.capacity, game.width - 30, this.y);
  };
  fill() {
    if (utility.level[CONTAINER_LEVEL] > 0 && this.filled < this.capacity) {
      this.filled++;
    }
  };
  sell() {
    if (this.full) {
      clickEffect.push(new Effects(utility.convert(container.worth), true, 1.5));
      utility.money += this.worth + this.bonus;
      utility.earned += this.worth + this.bonus;
      player.totalEarnings += this.worth + this.bonus;
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
    if (utility.level[CONTAINER_AUTOSELL] > 0) {
      if (this.full) this.sell();
    } else {
      if (this.sinSwitch) {
        this.sin -= 0.01;
      } else {
        this.sin += 0.01;
      }
      if (this.sin > 0.99) this.sinSwitch = true;
      if (this.sin < 0.01) this.sinSwitch = false;
    };
  };
};

class Effects {
  constructor(text, type, size = 1) {
    this.text = text;
    this.x = game.width / 2;
    this.y = 0.5 * game.textSize;
    this.font = size * game.textSize;
    this.type = type;
    this.time = 1;
  };
};

class Button {
  constructor(index, description, requirement = -1) {
    this.width = game.frameW;
    this.height = game.frameH;
    this.index = index;
    this.row;
    this.x = game.textSize;
    this.size = game.frameW;
    this.length = game.frameH;
    this.y = (1.2 * this.size * this.index) + (2.5 * game.textSize);
    this.level;
    this.price;
    this.requirement = requirement;
    this.description = description;
  };
  drawButton() {
    this.level = utility.level[this.index];
    this.price = utility.cost[this.index];
    ctxD.imageSmoothingEnabled = true;
    ctxD.imageSmoothingQuality = "high";
    if (this.price <= utility.money && utility.purchasable(this.index, this.requirement)) { // the button background
      ctxD.fillStyle = "hsl(105, 100%, 50%)";
      this.row = 2;
    } else {
      ctxD.fillStyle = "lightgrey";
      this.row = 1;
    };
    ctxD.fillRect(this.x, this.y - input.dY, this.length, this.size);
      //game.width - (2 * game.textSize), this.size);
    ctxD.drawImage(
      texture, // the texture sheet
      this.index * game.frameW, this.row * game.frameH, // texture x and y
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
  update() {
    if (game.state == 2) {
      utility.resetScroll(btn1.y, btn16.y);
    };
  };
};

let game = new Game;
let input = new InputHandler;
let utility = new Utility;
let btn1 = new Button(MONEY_PER_CLICK, "Increase the money earned per click");
let btn2 = new Button(COOKIE_EXPLODE, "The cookie will explode for bonus money");
let btn3 = new Button(EXPLODE_BONUS, "Increase bonus when the cookie explodes", COOKIE_EXPLODE);
let btn4 = new Button(EXPLODE_QUICKER, "The cookie will get larger faster", COOKIE_EXPLODE);
let btn5 = new Button(CONTAINER_LEVEL, "Increase container level");
let btn6 = new Button(CONTAINER_SIZE, "Decrease size of container", CONTAINER_LEVEL);
let btn7 = new Button(CONTAINER_PRICE, "Increase container sell price", CONTAINER_LEVEL);
let btn8 = new Button(CONTAINER_AUTOCLICK, "Auto clicks fill up containers", CONTAINER_LEVEL);
let btn9 = new Button(CONTAINER_AUTOSELL, "Auto sells full containers", CONTAINER_LEVEL);
let btn10 = new Button(ROLLING_MULTIPLIER, "A stacking bonus for quick clicks");
let btn11 = new Button(ROLLING_DURATION, "Increase the time before the bonus expires", ROLLING_MULTIPLIER);
let btn12 = new Button(ROLLING_BONUS, "Increase max bonus for clicking", ROLLING_MULTIPLIER);
let btn13 = new Button(OVERALL_MULTIPLIER, "Overall multiplier");
let btn14 = new Button(AUTOCLICKERS, "The cookie will auto click periodically");
let btn15 = new Button(GOLDEN_COOKIE, "Unlock golden cookies");
let btn16 = new Button(EXPLODE_FRENZY, "Unlock Explode Frenzy");
let cookie = new Cookie;
let goldCookie = new Cookie;
let player = new Player;
let container = new Container(CONTAINER_LEVEL);

then = Date.now();
game.loop();
