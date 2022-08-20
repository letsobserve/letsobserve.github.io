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

let lastTime = 0;
let now = new Date();
let time = now.getTime();
let expireTime = time + (365 * 24 * 60 * 60);
let latestTime, then, elapsed;
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
    if (this.width > this.height) { // width is greater
      this.textSize = this.frameW / 3;
    } else { // height is greater
      if (this.height > 600) { // height more than 600
        this.textSize = this.frameW;
      } else { // height less than 600
        this.textSize = this.frameW / 2;
      }
    };
    this.time = new Date();
  };
  draw0() { // game start screen
    ctxS.fillStyle = "hsl(195, 50%, 70%)"; // background
    ctxS.fillRect(0, 0, this.width, this.height); // background
    ctxS.imageSmoothingEnabled = true;
    ctxS.imageSmoothingQuality = "high";
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
    ctxS.fillText("Cookie", game.width / 2 , 3 * game.textSize); // game title
    ctxS.fillText("Frenzy", game.width / 2, 5 * game.textSize); // game title
    ctxS.textAlign = "middle";
    ctxS.textBaseline = "top";
    ctxS.font = this.textSize + "px calibri";
    ctxS.fillText("Play", game.width / 2, game.height / 1.95);
    ctxS.fillText("Exit", game.width / 2, (game.height / 1.95) + 2 * game.textSize);
  };
  draw1() { // player cookie screen
    // background
    ctxS.fillStyle = "hsl(195, 50%, 70%)";
    ctxS.fillRect(0, 0, this.width, this.height);
    utility.drawD();
    // money area
    ctxS.fillStyle = "white";
    ctxS.fillRect(0, 0, this.width, 2 * this.textSize);
    ctxS.fillStyle = "black";
    ctxS.textAlign = "center";
    ctxS.textBaseline = "top";
    ctxS.font = this.textSize / 1.5 + "px calibri";
    ctxS.globalAlpha = 0.5;
    ctxS.fillText("Shop", this.width / 2, this.textSize + 10);
    ctxS.textAlign = "right";
    ctxS.fillText("Prestige", this.width - 10, this.textSize + 10);
    ctxS.textAlign = "left";
    ctxS.fillText("Menu", 10, this.textSize + 10);
    ctxS.globalAlpha = 1;
    // draw the rest of the cookie screen
    if (utility.level[10] > 0) container.draw();
  };
  draw2() { // prestige screen
    // background
    ctxS.fillStyle = "hsl(195, 50%, 70%)";
    ctxS.fillRect(0, 0, this.width, this.height);
    // money area
    ctxS.fillStyle = "lightgrey";
    ctxS.fillRect(0, 0, this.width, 2 * this.textSize);
    ctxS.fillStyle = "black";
    ctxS.textAlign = "center";
    ctxS.textBaseline = "top";
    ctxS.font = this.textSize / 1.5 + "px calibri";
    ctxS.globalAlpha = 0.5;
    ctxS.fillText("Shop", this.width / 2, this.textSize + 10);
    ctxS.textAlign = "left";
    ctxS.fillText("Menu", 10, this.textSize + 10);
    ctxS.globalAlpha = 1;
    ctxS.textAlign = "right";
    ctxS.fillText("Prestige", this.width - 10, this.textSize + 10);
    utility.drawP();
  };
  draw3() { // third screen
    // background
    ctxS.fillStyle = "hsl(195, 50%, 70%)";
    ctxS.fillRect(0, 0, this.width, this.height);
    // money area
    ctxS.fillStyle = "lightgrey";
    ctxS.fillRect(0, 0, this.width, 2 * this.textSize);
    ctxS.fillStyle = "black";
    ctxS.textAlign = "center";
    ctxS.textBaseline = "top";
    ctxS.font = this.textSize / 1.5 + "px calibri";
    ctxS.globalAlpha = 0.5;
    ctxS.fillText("Shop", this.width / 2, game.textSize + 10);
    ctxS.textAlign = "right";
    ctxS.fillText("Prestige", this.width - 10, game.textSize + 10);
    ctxS.globalAlpha = 1;
    ctxS.textAlign = "left";
    ctxS.fillText("Menu", 10, game.textSize + 10);
    utility.drawT();
  };
  update() {
    utility.update();
    cookie.update();
    if (utility.level[10] > 0) container.update();
    player.update(now);
  };
  loop(now) {
    utility.time = new Date().getTime();
    now = Date.now();
    elapsed = now - then;
    if (elapsed > 1000 / game.FPS) { // throttle based on FPS
      then = now - (elapsed % (1000 / game.FPS));
      // clear canvas
      ctxS.clearRect(0, 0, game.width, game.height);
      ctxD.clearRect(0, 0, game.width, game.height);
      if (game.state > 0) game.update(); // update the game parameters
      if (!lastTime || now - lastTime >= (1000 - utility.tapRate)) { // auto click occasionally
        lastTime = now;
        utility.autoTapRounds = utility.autoTapLevel;
      };
      if (game.state == 0) { // draw the start menu
        game.draw0();
      } else if (game.state == 1) { // draw the cookie screen
        game.draw1();
        // draw the cookie
        cookie.draw(cookie.x, cookie.xV, cookie.y, cookie.yV, cookie.r, cookie.pulseCount, cookie.color(), 0);
        if (goldCookie.gold && !utility.upgrading) { // draw golden cookie
          goldCookie.draw(goldCookie.rX, 0, goldCookie.rY, 0, goldCookie.rR, 0, 3, 0);
          goldCookie.goldCount--;
        };
        if (player.returning) { // display when player returns
          player.returns();
        };
      } else if (game.state == 2) { // draw the shop screen
        btn1.update();
        utility.drawD();
        // draw the menu
        utility.drawM();
      } else if (game.state == 3) { // draw the prestige screen
        utility.drawD();
        game.draw2();
      } else { // draw the menu screen
        utility.drawD();
        game.draw3();
      };
    };
    if (utility.autoTapRounds > 0) { // go through each round of autoclicks
      utility.autoClick();
      utility.autoTapRounds--;
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
    document.addEventListener("click", (e) => {
      if (game.state == 0) { // game start screen
        if (e.x > 2 * game.frameW && e.x < (2 * game.frameW) + (4 * game.frameW) && e.y > game.height / 2 && e.y < (game.height / 2) + (1.5 * game.frameW)) { // play button
          game.state = 1;
        } else if (e.x > 2 * game.frameW && e.x < (2 * game.frameW) + (4 * game.frameW) && e.y > game.height / 1.5 && e.y < (game.height / 1.5) + (1.5 * game.frameW)) { // exit button
          window.history.go(-1);
        }; // game start screen
      } else if (game.state == 1) { // player cookie screen
        if (player.returning) player.returning = false;
        if (!this.tap) { // if player didnt tapped the screeen
          if ((Math.pow(e.x - cookie.x, 2) + Math.pow(e.y - cookie.y, 2)) < Math.pow(cookie.r + cookie.pulseCount, 2)) { // check if in the cookie
            this.lastClick = utility.time; // note the time
            if (utility.rolling && utility.clickCount < utility.maxClickCount) utility.clickCount++; // check if click count should increase
            if (utility.inFrenzy) { // check if frenzy time should increase
              if (utility.frenzyLeft < utility.frenzyMax - 5) {
                utility.frenzyLeft += 10;
              } else if (utility.frenzyLeft < utility.frenzyMax) {
                utility.frenzyLeft++;
              };
            };
            // if cookie should expand
            if (cookie.r + cookie.pulseCount < cookie.r * 3) {
              cookie.expand();
              container.fill();
            } else {
              cookie.reset();
              container.fill();
            };
          };
          if (goldCookie.gold && (Math.pow(e.x - goldCookie.rX, 2) + Math.pow(e.y - goldCookie.rY, 2)) < Math.pow(goldCookie.rR, 2)) { // check if inside golden cookie
            goldCookie.goldReset();
            this.lastClick = utility.time; // note the time
            if (utility.rolling && utility.clickCount < utility.maxClickCount) utility.clickCount++; // check if click count should increase
            if (utility.inFrenzy) { // check if frenzy time should increase
              if (utility.frenzyLeft < utility.frenzyMax - 5) {
                utility.frenzyLeft += 10;
              } else if (utility.frenzyLeft < utility.frenzyMax) {
                utility.frenzyLeft++;
              };
            };
          };
        };
        if (e.x > game.width / 3 && e.x < game.width - (game.width / 3) && e.y < 2 * game.textSize) { // check if shop button clicked
          game.state = 2;
          input.dY = this.lastdY;
        };
        if (e.x > game.width - (game.width / 3) && e.y < 2 * game.textSize) { // check if prestige button clicked
          game.state = 3;
          input.dY = this.lastdY;
        };
        if (e.x < game.width / 3 && e.y < 2 * game.textSize) { //check if menu button clicked
          game.state = 4;
          input.dY = this.lastdY;
        };
        if (utility.level[10] > 0 && yDown > container.y && xDown > container.x) { //check if jar is tapped
          container.sell();
        };
        (10, 2 * game.textSize + 10, game.width - 2 * game.frameW, game.frameH)
        if (utility.level[15] > 0 && yDown > 2 * game.textSize + 10 && yDown < 2 * game.textSize + 10 + game.frameH && xDown > 10 && xDown < game.width - 2 * game.frameW) {
          if (utility.canFrenzy) {
            utility.frenzyLeft = utility.frenzyMax;
            utility.inFrenzy = true;
            utility.canFrenzy = false;
          } else {
            return;
          };
        };
      } else if (game.state == 2) { // shop screen

        //if (e.x < game.width && e.y < 2 * game.textSize) {utility.level =[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];utility.money = 0;utility.earned=0;utility.prestige=0}; // reset levels and money

        if (e.x < game.width && e.y > game.height - game.textSize) { // close the shop
          game.state = 1;
          this.lastdY = input.dY;
          input.dY = 0;
        };
        if (e.x > game.width / 3 && e.x < game.width - (game.width / 3) && e.y < 2 * game.textSize) { // shop screen
          game.state = 1;
          this.lastdY = input.dY;
          input.dY = 0;
        };
        if (e.x > game.width - (game.width / 3) && e.y < 2 * game.textSize) { // prestige screen
          game.state = 3;
          this.lastdY = input.dY;
          input.dY = 0;
        };
        if (e.x < game.width / 3 && e.y < 2 * game.textSize) { // menu screen
          game.state = 4;
          this.lastdY = input.dY;
          input.dY = 0;
        };
        if (e.x > btn1.x && e.x < game.width - (2 * game.frameW) && e.y > 2 * game.textSize && e.y < game.height - game.textSize) { // check if in upgrade button area
          // check each button
          // max level && affordable && position
          if (utility.cost[0] <= utility.money && e.y > btn1.y - input.dY && e.y < btn1.y + game.frameH - input.dY) {
            utility.upgrade(utility.cost[0], 0, "extraMoney");
          };
          if (utility.level[1] == 0 && utility.cost[1] <= utility.money && e.y > btn2.y - input.dY && e.y < btn2.y + game.frameH - input.dY) {
            utility.upgrade(utility.cost[1], 1, "explodable");
          };
          if (utility.cost[2] <= utility.money && e.y > btn3.y - input.dY && e.y < btn3.y + game.frameH - input.dY) {
            utility.upgrade(utility.cost[2], 2, "explodeBonus");
          };
          if (utility.level[3] < 20 && utility.cost[3] <= utility.money && e.y > btn4.y - input.dY && e.y < btn4.y + game.frameH - input.dY) {
            utility.upgrade(utility.cost[3], 3, "explodeMore");
          };
          if (utility.level[4] == 0 && utility.cost[4] <= utility.money && e.y > btn5.y - input.dY && e.y < btn5.y + game.frameH - input.dY) {
            utility.upgrade(utility.cost[4], 4, "rolling");
          };
          if (utility.level[4] == 1 && utility.level[5] < 50 && utility.cost[5] <= utility.money && e.y > btn6.y - input.dY && e.y < btn6.y + game.frameH - input.dY) {
            utility.upgrade(utility.cost[5], 5, "rollingDur");
          };
          if (utility.level[4] == 1 && utility.cost[6] <= utility.money && e.y > btn7.y - input.dY && e.y < btn7.y + game.frameH - input.dY) {
            utility.upgrade(utility.cost[6], 6, "rollingMax");
          };
          if (utility.cost[7] <= utility.money && e.y > btn8.y - input.dY && e.y < btn8.y + game.frameH - input.dY) {
            utility.upgrade(utility.cost[7], 7, "multiplier");
          };
          if (utility.level[8] < 60 && utility.cost[8] <= utility.money && e.y > btn9.y - input.dY && e.y < btn9.y + game.frameH - input.dY) {
            utility.upgrade(utility.cost[8], 8, "autoClick");
          };
          if (utility.level[9] == 0 && utility.cost[9] <= utility.money && e.y > btn10.y - input.dY && e.y < btn10.y + game.frameH - input.dY) {
            utility.upgrade(utility.cost[9], 9, "golden");
          };
          if (utility.level[10] < 5 && utility.cost[10] <= utility.money && e.y > btn11.y - input.dY && e.y < btn11.y + game.frameH - input.dY) {
            utility.upgrade(utility.cost[10], 10, "containerLvl");
          };
          if (utility.level[10] > 0 && utility.cost[11] <= utility.money && e.y > btn12.y - input.dY && e.y < btn12.y + game.frameH - input.dY) {
            if (container.capacity > (5 * utility.level[10]))
            utility.upgrade(utility.cost[11], 11, "containerCap");
          };
          if (utility.level[10] > 0 && utility.cost[12] <= utility.money && e.y > btn13.y - input.dY && e.y < btn13.y + game.frameH - input.dY) {
            utility.upgrade(utility.cost[12], 12, "containerWorth");
          };
          if (utility.level[10] > 0 && utility.level[13] == 0 && utility.cost[13] <= utility.money && e.y > btn14.y - input.dY && e.y < btn14.y + game.frameH - input.dY) {
            utility.upgrade(utility.cost[13], 13, "containerFill");
          };
          if (utility.level[10] > 0 && utility.level[14] == 0 && utility.cost[14] <= utility.money && e.y > btn15.y - input.dY && e.y < btn15.y + game.frameH - input.dY) {
            utility.upgrade(utility.cost[14], 14, "containerSell");
          };
          if (utility.level[15] == 0 && utility.cost[15] <= utility.money && e.y > btn16.y - input.dY && e.y < btn16.y + game.frameH - input.dY) {
            utility.upgrade(utility.cost[15], 15, "explodeFrenzy");
          };
        };
      } else if (game.state == 3) { // prestige screen
        if (!utility.prestigeConfirm && e.x < game.width && e.y > game.height - game.textSize) { // close the prestige screen
          game.state = 1;
          input.dY = this.lastdY;
        };
        if (!utility.prestigeConfirm && e.x > game.width / 3 && e.x < game.width - (game.width / 3) && e.y < 2 * game.textSize) { // shop screen
          game.state = 2;
          input.dY = this.lastdY;
        };
        if (!utility.prestigeConfirm && e.x > game.width - (game.width / 3) && e.y < 2 * game.textSize) { // prestige screen
          game.state = 1;
          input.dY = this.lastdY;
        };
        if (!utility.prestigeConfirm && e.x < game.width / 3 && e.y < 2 * game.textSize) { // menu screen
          game.state = 4;
          input.dY = this.lastdY;
        };
        if (!utility.prestigeConfirm && e.x > game.width / 4 && e.x < ((3 * game.width) / 4) && e.y > game.height / 2 - (3 * game.frameH / 2) && e.y < game.height / 2 + (3 * game.frameH / 2)) { // click on prestige button
          utility.prestigeConfirm = true;
        };
        if (utility.prestigeConfirm && e.y < game.height / 2.5 || e.y > (game.height / 2) + (1.5 * game.textSize) || e.x < game.width / 5 || e.x > game.width - (game.width / 5)) { // click off the prestige button
          utility.prestigeConfirm = false;
        };
        if (utility.prestigeConfirm && e.y > game.height / 2 && e.y < game.height / 1.75) { // prestige confirm buttons
          if (e.x > game.width / 2 - (2 * game.textSize) && e.x < game.width / 2 - (game.textSize)) { // confirm
            utility.setPrestige();
          };
          if (e.x > (game.width / 2) + (game.textSize) && e.x < (game.width / 2) + (2 * game.textSize)) {
            utility.prestigeConfirm = false;
          };
        };
      } else { // third screen
        // shop screen
        if (e.x > game.width / 3 && e.x < game.width - (game.width / 3) && e.y < 2 * game.textSize) {
          game.state = 2;
          input.dY = this.lastdY;
        };
        // prestige screen
        if (e.x > game.width - (game.width / 3) && e.y < 2 * game.textSize) {
          game.state = 3;
          input.dY = this.lastdY;
        };
        // third screen
        if (e.x < game.width / 3 && e.y < 2 * game.textSize) {
          game.state = 1;
          input.dY = this.lastdY;
        };
      };
    });
    document.addEventListener("touchstart", (e) => {
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
            this.lastClick = utility.time; // note the time
            if (utility.rolling && utility.clickCount < utility.maxClickCount) utility.clickCount++; // check if click count should increase
            if (utility.inFrenzy) { // check if frenzy time should increase
              if (utility.frenzyLeft < utility.frenzyMax - 5) {
                utility.frenzyLeft += 10;
              } else if (utility.frenzyLeft < utility.frenzyMax) {
                utility.frenzyLeft++;
              };
            };
            if (cookie.r + cookie.pulseCount < cookie.r * 3) { // if cookie should expand
              cookie.expand();
              container.fill();
            } else {
              cookie.reset();
              container.fill();
            };
          };
          if (goldCookie.gold && (Math.pow(ongoingTouches[i].clientX - goldCookie.rX, 2) + Math.pow(ongoingTouches[i].clientY - goldCookie.rY, 2)) < Math.pow(goldCookie.rR, 2)) { // check if inside golden cookie
            goldCookie.goldReset();
            this.lastClick = utility.time; // note the time
            if (utility.rolling && utility.clickCount < utility.maxClickCount) utility.clickCount++; // check if click count should increase
            if (utility.inFrenzy) { // check if frenzy time should increase
              if (utility.frenzyLeft < utility.frenzyMax - 5) {
                utility.frenzyLeft += 10;
              } else if (utility.frenzyLeft < utility.frenzyMax) {
                utility.frenzyLeft++;
              };
            };
          };
        };
      };
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
  };
};

class Player {
  constructor() {
    this.getMoney = parseInt(localStorage.getItem("playerMoney"));
    this.money = utility.money;
    this.prestige = utility.prestige;
    this.lastPlay = parseInt(localStorage.getItem("playerLatestTime"));
    if (!Number.isInteger(this.lastPlay)) {
      this.lastPlay = game.time;
    };
    this.lastEPS = parseInt(localStorage.getItem("playerBestEPS"));
    if (!Number.isInteger(this.lastEPS)) {
      this.lastEPS = 0;
    };
    this.lastPlaySeconds = (game.time - this.lastPlay) / 1000;
    this.returnWorth = Math.ceil(this.lastEPS * this.lastPlaySeconds);
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
    setInterval(this.calcEarning.bind(this), 2000);
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
    this.EPS = (this.earnedNow - this.earnedThen) / 2;
    this.earnedThen = this.earnedNow;
  };
  update(now) {
    // set up a save function
    localStorage.setItem("playerMoney", utility.money);
    localStorage.setItem("playerMoneyEarned", utility.earned);
    localStorage.setItem("playerUpgrades", utility.level);
    localStorage.setItem("upgradeCosts", utility.cost);
    localStorage.setItem("playerLatestTime", latestTime);
    localStorage.setItem("playerPrestige", utility.prestige);
    if (localStorage.getItem("playerBestEPS") < player.EPS) {
      localStorage.setItem("playerBestEPS", player.EPS);
    };
    this.money = utility.money;
    this.prestige = utility.prestige;
    if (this.money > 1000) { // convert money to 6 sig. fig.
      this.money = utility.convert(utility.money);
    };
  };
};

// 0 = increase money per click, 1 = cookie explodable
// 2 = increase bonus money, 3 = less clicks to explode
// 4 = rolling multiplier, 5 = increase rolling duration
// 6 = increase rolling max, 7 = overall multiplier,
// 8 = auto click, 9 = unlock golden cookies
// 10 = level up container, 11 = less cookies to fill container
// 12 = increase container worth, 13 = auto clicks pack containers
// 14 = auto sell containers, 15 = unlock cookie explode frenzy

class Utility {
  constructor() {
    this.checkMark = "\uD83D\uDDF9";
    this.time = 0;
    // get the stored money value
    this.money = parseInt(localStorage.getItem("playerMoney"));
    if (!Number.isInteger(this.money)) {
      this.money = 0;
    };
    this.earned = parseInt(localStorage.getItem("playerMoneyEarned"));
    if (!Number.isInteger(this.earned)) {
      this.earned = 0;
    };
    // 0 = increase money per click, 1 = cookie explodable
    // 2 = increase bonus money, 3 = less clicks to explode
    // 4 = rolling multiplier, 5 = increase rolling duration
    // 6 = increase rolling max, 7 = overall multiplier,
    // 8 = auto click, 9 = unlock golden cookies
    // 10 = level up container, 11 = less cookies to fill container
    // 12 = increase container worth, 13 = auto clicks pack containers
    // 14 = auto sell containers, 15 = unlock cookie explode frenzy
    // set the price according to levels
    this.costFactor = [1.5, 1, 1.35, 2, 1, 2.5, 5, 10.5, 1.9, 1, 20, 2.22, 2, 1, 1, 1];
    // get the stored upgrade values
    this.level = [];
    this.cost = [20, 250, 600, 1000, 7500, 10500, 12000, 50000, 5000, 5000000, 1500, 5000, 10000, 100000, 5000, 10000000];
    try { // get the player details
      this.getLevel = localStorage.getItem("playerUpgrades").split(",");
      this.getCosts = localStorage.getItem("upgradeCosts").split(",");
      if (this.getLevel.length < 16) { // if less than all upgrades
        // include new upgrades
      };
      for (let i = 0; i < this.getLevel.length; i++) {
        this.level.push(parseInt(this.getLevel[i]));
      };
      for (let i = 0; i < this.getCosts.length; i++) {
        if (this.level[i] > 0) {
          this.cost.splice(i, 1, parseInt(this.getCosts[i]));
        };
        if (!Number.isInteger(this.cost[i])) {
          this.cost.splice(i, 1, this.checkMark);
        };
      };
    } catch { // set new player
      this.level = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    };
    // testing purposes
    // this.cost = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
    this.event = null;
    this.occuring = 0;
    this.switch = false;
    // upgrade variables
    if (this.level[1] > 0) { // explodable cookie
      this.explodable = true;
    } else {
      this.explodable = false;
    };
    if (this.level[4] > 0) { // cookie rolling bonus
      this.rolling = true;
    } else {
      this.rolling = false;
    };
    this.rollTime = 300 * (1 + this.level[5]); // cookie rolling duration
    if (this.level[9] > 0) { // gold cookie
      this.goldable = true;
    } else {
      this.goldable = false;
    };
    this.clickCount = 0; // current click count
    this.maxClickCount = 5 + (this.level[6] * 5); // max rolling click count
    this.multiplier = 1 + this.level[7];
    if (this.level[8] > 0) { // auto click
      this.autoTap = true;
    } else {
      this.autoTap = false;
    };
    this.autoTapLevel = this.level[8];
    this.autoTapRounds = 0;
    this.tapRate = 0;
    if (this.level[15] > 0) { // cookie frenzy
      this.frenzy = true;
    } else {
      this.frenzy = false;
    };
    this.canFrenzy = true;
    this.inFrenzy = false;
    this.frenzyMax = 120; // frenzy time in frame per second
    this.frenzyLeft = 0;
    this.frenzyReset = 0;
    this.frenzyResetMax = 10 * 60 * 60; // frenzy reset time in milliseconds
    this.prestige = parseInt(localStorage.getItem("playerPrestige"));
    if (!Number.isInteger(this.prestige)) { // if prestige not found
      this.prestige = 0;
    };
    this.prestigeBonus = (1 + ((this.prestige) * 0.1)).toFixed(1);
    this.prestigeUpgrade = 0;
    this.prestigeFor = Math.floor(Math.pow((1 + this.prestigeUpgrade) * (this.money / 1000000000), 0.15));
  };
  drawD() { // draw the dynamic cookie screen
    ctxD.textAlign = "center";
    for (let i = 0; i < clickEffect.length; i++) { // draw the earned money
      if (clickEffect[i].time > 0) {
        ctxD.font = clickEffect[i].font;
        ctxD.globalAlpha = clickEffect[i].time;
        if (clickEffect[i].type) { // show earn money or lose money
          ctxD.fillStyle = "green";
          ctxD.fillText("$" + clickEffect[i].text, clickEffect[i].x, clickEffect[i].y);
          clickEffect[i].time -= 0.01;
        } else {
          ctxD.fillStyle = "red";
          ctxD.fillText("-$" + clickEffect[i].text, clickEffect[i].x, clickEffect[i].y + (clickEffect.indexOf(clickEffect[i]) * game.textSize / 3));
          clickEffect[i].time -= 0.005;
        };
        ctxD.globalAlpha = 1;
      } else {
        clickEffect.splice(0, 1);
      }
    };
    ctxD.fillStyle = "black";
    ctxD.textAlign = "left";
    ctxD.textBaseline = "top";
    ctxD.font = game.textSize + "px calibri";
    ctxD.fillText("$" + player.money, 5, 5); // draw money
    ctxD.font = game.textSize / 2 + "px calibri";
    ctxD.textAlign = "right";
    ctxD.fillText(utility.convert(player.EPS) + " $/s", game.width - 5, 5); // draw the money per second
    if (this.rolling) { // draw the rolling multiplier
      // bounding ellipse
      ctxD.fillStyle = "white";
      ctxD.strokeStyle = "black";
      ctxD.fillRect(
        game.width - (2 * game.textSize) + 25, // x
        2 * game.textSize + 10, // y
        2 * game.textSize - 40, // width
        game.textSize, // height
      );
      // slow filling timer
      if (input.lastClick > this.rollTime && this.clickCount > 0) {
        ctxD.globalAlpha = ((this.time - input.lastClick) / this.rollTime);
        ctxD.fillStyle = "rgb(255,0,0)";
        ctxD.fillRect(
          game.width - 15, // x
          2 * game.textSize + 10, // y
          -((this.time - input.lastClick) / this.rollTime) * (2 * game.textSize - 40), // width
          game.textSize, // height
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
      ctxD.strokeText("x " + this.clickCount, game.width - (1.5 * game.textSize), 2.5 * game.textSize + 5);
      ctxD.lineWidth = 5;
      ctxD.fillText("x " + this.clickCount, game.width - (1.5 * game.textSize), 2.5 * game.textSize + 5);
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
  drawM() { // draw the dynamic upgrade screen
    // background
    ctxD.fillStyle = "white";
    ctxD.fillRect(0, 0, game.width, game.height);
    // the buttons
    btn1.draw(1);
    btn2.draw(2);
    btn3.draw(3);
    btn4.draw(4);
    btn5.draw(10);
    btn6.draw(11);
    btn7.draw(12);
    btn8.draw(13);
    btn9.draw(14);
    btn10.draw(15);
    btn11.draw(5);
    btn12.draw(6);
    btn13.draw(7);
    btn14.draw(8);
    btn15.draw(9);
    btn16.draw(16);
    // the button text
    btn1.drawText(utility.level[0], utility.convert(utility.cost[0]), 1, "More money per cookie");
    btn2.drawText(utility.level[1], utility.convert(utility.cost[1]), 2, "Exploding cookie");
    if (utility.level[1] > 0) { // requiring exploding cookie
      btn3.drawText(utility.level[2], utility.convert(utility.cost[2]), 3, "Increase explode bonus");
      btn4.drawText(utility.level[3], utility.convert(utility.cost[3]), 4, "Decrease clicks to explode");
    } else {
      btn3.drawText(utility.level[2], utility.convert(utility.cost[2]), 3, "Requires Exploding cookie");
      btn4.drawText(utility.level[3], utility.convert(utility.cost[3]), 4, "Requires Exploding cookie");
    };
    btn5.drawText(utility.level[4], utility.convert(utility.cost[4]), 10, "Rolling clicks bonus");
    if (utility.level[4] > 0) { // requiring rolling bonus
      btn6.drawText(utility.level[5], utility.convert(utility.cost[5]), 11, "Increase rolling click duration");
      btn7.drawText(utility.level[6], utility.convert(utility.cost[6]), 12, "Increase max rolling bonus");
    } else {
      btn6.drawText(utility.level[5], utility.convert(utility.cost[5]), 11, "Requires Rolling clicks bonus");
      btn7.drawText(utility.level[6], utility.convert(utility.cost[6]), 12, "Requires Rolling clicks bonus");
    };
    btn8.drawText(utility.level[7], utility.convert(utility.cost[7]), 13, "Overall multiplier");
    btn9.drawText(utility.level[8], utility.convert(utility.cost[8]), 14, "Auto clicking cookie");
    btn10.drawText(utility.level[9], utility.convert(utility.cost[9]), 15, "Unlock golden cookies");
    if (utility.level[10] > 0) { // requiring containers
      btn11.drawText(utility.level[10], utility.convert(utility.cost[10]), 5, "Increase container level");
      btn12.drawText(utility.level[11], utility.convert(utility.cost[11]), 6, "Decrease size of container");
      btn13.drawText(utility.level[12], utility.convert(utility.cost[12]), 7, "Increase container sell price");
      btn14.drawText(utility.level[13], utility.convert(utility.cost[13]), 8, "Auto clicks fill up containers");
      btn15.drawText(utility.level[14], utility.convert(utility.cost[14]), 9, "Auto sells full containers");
    } else {
      btn11.drawText(utility.level[10], utility.convert(utility.cost[10]), 5, "Unlock containers");
      btn12.drawText(utility.level[11], utility.convert(utility.cost[11]), 6, "Requires Unlock containers");
      btn13.drawText(utility.level[12], utility.convert(utility.cost[12]), 7, "Requires Unlock containers");
      btn14.drawText(utility.level[13], utility.convert(utility.cost[13]), 8, "Requires Unlock containers");
      btn15.drawText(utility.level[14], utility.convert(utility.cost[14]), 9, "Requires Unlock containers");
    };
    btn16.drawText(utility.level[15], utility.convert(utility.cost[15]), 16, "Unlock Explode Frenzy");
    ctxD.fillStyle = "white";
    ctxD.fillRect(0, game.height - game.textSize, game.width, game.textSize);
    ctxD.globalAlpha = 0.45;
    ctxD.fillStyle = "red";
    ctxD.fillRect(0, game.height - game.textSize, game.width, game.textSize);
    ctxD.globalAlpha = 1;
    ctxD.fillStyle = "lightgrey";
    ctxD.fillRect(0, 0, game.width, 2 * game.textSize); // money area
    ctxD.fillStyle = "black";
    ctxD.textAlign = "center";
    ctxD.textBaseline = "top";
    ctxD.font = game.textSize / 1.5 + "px calibri";
    ctxD.fillText("Shop", game.width / 2, game.textSize + 10);
    ctxD.textAlign = "right";
    ctxD.globalAlpha = 0.5;
    ctxD.fillText("Prestige", game.width - 10, game.textSize + 10);
    ctxD.textAlign = "left";
    ctxD.fillText("Menu", 10, game.textSize + 10);
    ctxD.globalAlpha = 1;
    ctxD.textAlign = "left";
    ctxD.font = game.textSize + "px calibri";
    ctxD.fillText("$" + player.money, 5, 5); // draw money
    ctxD.textAlign = "center";
    ctxD.fillText("Close Shop", game.width / 2, game.height - game.textSize);
    ctxD.font = game.textSize / 2 + "px calibri";
    ctxD.textAlign = "right";
    ctxD.fillText(utility.convert(player.EPS) + " $/s", game.width - 5, 5); // draw the money per second
    ctxD.strokeStyle = "black";
    ctxD.lineWidth = 10;
    ctxD.strokeRect(0, game.height - game.textSize, game.width, game.height);
  };
  drawP() { // draw the dynamic prestige screen
    // background
    ctxD.fillStyle = "hsl(195, 50%, 70%)";
    ctxD.fillRect(0, 2 * game.textSize, game.width, game.height);
    // money area
    ctxD.fillStyle = "lightgrey";
    ctxD.fillRect(0, 0, game.width, 2 * game.textSize);
    ctxD.fillStyle = "black";
    ctxD.textAlign = "center";
    ctxD.textBaseline = "top";
    ctxD.font = game.textSize / 1.5 + "px calibri";
    ctxD.globalAlpha = 0.5;
    ctxD.fillText("Shop", game.width / 2, game.textSize + 10);
    ctxD.textAlign = "left";
    ctxD.fillText("Menu", 10, game.textSize + 10);
    ctxD.textAlign = "right";
    ctxD.globalAlpha = 1;
    ctxD.fillText("Prestige", game.width - 10, game.textSize + 10);
    ctxD.globalAlpha = 1;
    ctxD.fillStyle = "black";
    ctxD.textAlign = "left";
    ctxD.textBaseline = "top";
    ctxD.font = game.textSize + "px calibri";
    ctxD.fillText("$" + player.money, 5, 5); // draw money
    ctxD.font = game.textSize / 2 + "px calibri";
    ctxD.textAlign = "right";
    ctxD.fillText(utility.convert(player.EPS) + " $/s", game.width - 5, 5); // draw the money per second
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
    ctxD.fillText(player.prestige + "  currency", game.width - game.frameW, 4.35 * game.textSize); // how much prestige the player currently has
    ctxD.textAlign = "center";
    ctxD.fillText("increasing your earnings by:", game.width / 2, 4.85 * game.textSize);
    ctxD.fillText(utility.prestigeBonus + " x", game.width / 2, 5.5 * game.textSize); // calculate how much the prestige amplifies profits
    ctxD.textAlign = "center";
    ctxD.fillStyle = "white";
    ctxD.fillRect(0, game.height - game.textSize, game.width, game.textSize);
    ctxD.globalAlpha = 0.45;
    ctxD.fillStyle = "red";
    ctxD.fillRect(0, game.height - game.textSize, game.width, game.textSize);
    ctxD.globalAlpha = 1; // close bar
    ctxD.fillStyle = "black";
    ctxD.strokeStyle = "black";
    ctxD.font = game.textSize + "px calibri";
    ctxD.fillText("Close Prestige", game.width / 2, game.height - game.textSize); // close prestige text
    ctxD.strokeRect(0, game.height - game.textSize, game.width, game.height);
    ctxD.fillStyle = "white";
    ctxD.fillRect(game.width / 2 - (game.width / 4), game.height / 2 - (3 * game.textSize / 2), game.width / 2, 3 * game.textSize); // the prestige button
    ctxD.fillStyle = "black";
    ctxD.textBaseline = "middle";
    ctxD.font  = game.textSize / 2 + "px calibri";
    ctxD.fillText("Prestige for :", game.width / 2, (game.height / 2) - game.textSize); // prestige button text
    ctxD.fillText("currency", game.width / 2, (game.height / 2) + game.textSize); // prestige units
    ctxD.font = game.textSize / 1.5 + "px calibri";
    ctxD.fillText(utility.prestigeFor, game.width / 2, game.height / 2); // prestige amount
    ctxD.font = game.textSize / 2 + "px calibri";
    ctxD.textAlign = "center";
    ctxD.fillText("Prestiging gives you additional profits,", game.width / 2, game.height - (5 * game.textSize));
    ctxD.fillText("however your progress is reset.", game.width / 2, game.height - (4.5 * game.textSize));
    ctxD.fillText("(It's always worth it to prestige!)", game.width / 2, game.height - (4 * game.textSize)); // prestige information text
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
  drawT() { // draw the dynamic third screen
    // background
    ctxD.fillStyle = "hsl(195, 50%, 70%)";
    ctxD.fillRect(0, 2 * game.textSize, game.width, game.height);
    ctxD.fillStyle = "black";
    ctxD.textAlign = "left";
    ctxD.textBaseline = "top";
    ctxD.font = game.textSize + "px calibri";
    ctxD.fillText("$" + player.money, 5, 5); // draw money
    ctxD.font = game.textSize / 2 + "px calibri";
    ctxD.textAlign = "right";
    ctxD.fillText(utility.convert(player.EPS) + " $/s", game.width - 5, 5); // draw the money per second
    ctxD.lineWidth = 10;
    ctxD.textAlign = "center";
    ctxD.fillStyle = "white";
    ctxD.fillRect(0, game.height - game.textSize, game.width, game.textSize);
    ctxD.globalAlpha = 0.45;
    ctxD.fillStyle = "red";
    ctxD.fillRect(0, game.height - game.textSize, game.width, game.textSize);
    ctxD.globalAlpha = 1;
    ctxD.fillStyle = "black";
    ctxD.strokeStyle = "black";
    ctxD.font = game.textSize + "px calibri";
    ctxD.fillText("Close Third", game.width / 2, game.height - game.textSize);
    ctxD.strokeRect(0, game.height - game.textSize, game.width, game.height);
  };
  explode() {
    cookie.exploding = true;
    cookie.explode = cookie.explodeFor;
    for (var i = 0; i < 25; i++) {
      if (cookie.expCookie.length < 500) cookie.expCookie.push(new Cookie);
    };
  };
  autoClick() {
    if (utility.level[13] > 0) container.fill();
    cookie.expand();
  };
  upgrade(cost, reference, specific) {
    utility.occuring = 100;
    utility.money -= cost;
    utility.level[reference]++;
    utility.event = specific;
    switch (specific) {
      case "extraMoney":
      break;
      case "explodable":
      this.explodable = true;
      break;
      case "explodeBonus":
      break;
      case "explodeMore":
      cookie.pulse += 5;
      break;
      case "rolling":
      // start counting time between clicks
      this.rolling = true;
      break;
      case "rollingDur":
      // more duration before expiry
      this.rollTime = 300 * (1 + this.level[5]);
      break;
      case "rollingMax":
      // higher rolling count before stopping
      break;
      case "multiplier":
      this.multiplier++;
      break;
      case "autoClick":
      this.autoTap = true;
      this.autoTapLevel = this.level[8];
      break;
      case "golden":
      this.goldable = true;
      goldCookie = new Cookie();
      goldCookie.goldCount = 100;
      goldCookie.gold = true;
      break;
      case "containerLvl":
      container.level++;
      break;
      case "containerCap":
      container.sell();
      break;
      case "containerWorth":
      container.bonus += 5;
      break;
      case "containerFill":
      container.increasing = true;
      break;
      case "containerSell":
      container.selling = true;
      break;
      case "explodeFrenzy":
      utility.frenzy = true;
      break;
    }
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
      return number;
    };
  };
  parse(parameter) { // get the integer
    return parseInt(parameter);
  };
  newPrice(price, factor) { // handle new upgrade costs
    return Math.floor(price * factor);
  };
  events() {
    switch (utility.event) {
      case "click":
      clickEffect.push(new Effects(utility.convert(cookie.worth), game.width / 2, game.textSize * 2, true, (game.textSize / 1.5) + (1.5 * clickEffect.length)));
      utility.event = null;
      break;
      case "reset":
      clickEffect.push(new Effects(utility.convert(cookie.bonusWorth), game.width / 2, 4 * game.textSize, true, game.textSize + (1.25 * clickEffect.length)));
      utility.event = null;
      break;
      case "frenzy":
      clickEffect.push(new Effects(utility.convert(5 * cookie.bonusWorth), game.width / 2, 5 * game.textSize, true, game.textSize  + (1.5 * clickEffect.length)));
      utility.event = null;
      break;
      case "goldCookie":
      clickEffect.push(new Effects(utility.convert(cookie.goldWorth), game.width / 2, game.height - (4.2 * game.textSize), true, 2 * game.textSize));
      utility.event = null;
      break;
      case "extraMoney":
      clickEffect.push(new Effects(utility.convert(utility.cost[0]), game.width / 2, game.height - (3 * game.textSize), false, 2 * game.textSize));
      utility.cost[0] = utility.newPrice(utility.cost[0], utility.costFactor[0], utility.level[0]);
      utility.event = null;
      break;
      case "explodable":
      clickEffect.push(new Effects(utility.convert(utility.cost[1]), game.width / 2, game.height - (3 * game.textSize), false, 2 * game.textSize));
      utility.cost[1] = utility.checkMark;
      utility.event = null;
      break;
      case "explodeBonus":
      clickEffect.push(new Effects(utility.convert(utility.cost[2]), game.width / 2, game.height - (3 * game.textSize), false, 2 * game.textSize));
      utility.cost[2] = utility.newPrice(utility.cost[2], utility.costFactor[2], utility.level[2]);
      utility.event = null;
      break;
      case "explodeMore":
      clickEffect.push(new Effects(utility.convert(utility.cost[3]), game.width / 2, game.height - (3 * game.textSize), false, 2 * game.textSize));
      utility.cost[3] = utility.newPrice(utility.cost[3], utility.costFactor[3], utility.level[3]);
      utility.event = null;
      break;
      case "rolling":
      clickEffect.push(new Effects(utility.convert(utility.cost[4]), game.width / 2, game.height - (3 * game.textSize), false, 2 * game.textSize));
      utility.cost[4] = utility.checkMark;
      utility.event = null;
      break;
      case "rollingDur":
      // more duration before expiry
      clickEffect.push(new Effects(utility.convert(utility.cost[5]), game.width / 2, game.height - (3 * game.textSize), false, 2 * game.textSize));
      utility.cost[5] = utility.newPrice(utility.cost[5], utility.costFactor[5], utility.level[5]);
      utility.event = null;
      break;
      case "rollingMax":
      // higher rolling count before stopping
      clickEffect.push(new Effects(utility.convert(utility.cost[6]), game.width / 2, game.height - (3 * game.textSize), false, 2 * game.textSize));
      utility.maxClickCount += 5;
      utility.cost[6] = utility.newPrice(utility.cost[6], utility.costFactor[6], utility.level[6]);
      utility.event = null;
      break;
      case "multiplier":
      clickEffect.push(new Effects(utility.convert(utility.cost[7]), game.width / 2, game.height - (3 * game.textSize), false, 2 * game.textSize));
      utility.cost[7] = utility.newPrice(utility.cost[7], utility.costFactor[7], utility.level[7]);
      utility.event = null;
      break;
      case "autoClick":
      clickEffect.push(new Effects(utility.convert(utility.cost[8]), game.width / 2, game.height - (3 * game.textSize), false, 2 * game.textSize));
      utility.cost[8] = utility.newPrice(utility.cost[8], utility.costFactor[8], utility.level[8]);
      utility.event = null;
      break;
      case "golden":
      clickEffect.push(new Effects(utility.convert(utility.cost[9]), game.width / 2, game.height - (3 * game.textSize), false, 2 * game.textSize));
      utility.cost[9] = utility.checkMark;
      utility.event = null;
      break;
      case "containerLvl":
      clickEffect.push(new Effects(utility.convert(utility.cost[10]), game.width / 2, game.height - (3 * game.textSize), false, 2 * game.textSize));
      utility.cost[10] = utility.newPrice(utility.cost[10], utility.costFactor[10], utility.level[10]);
      utility.event = null;
      break;
      case "containerCap":
      clickEffect.push(new Effects(utility.convert(utility.cost[11]), game.width / 2, game.height - (3 * game.textSize), false, 2 * game.textSize));
      utility.cost[11] = utility.newPrice(utility.cost[11], utility.costFactor[11], utility.level[11]);
      utility.event = null;
      break;
      case "containerWorth":
      clickEffect.push(new Effects(utility.convert(utility.cost[12]), game.width / 2, game.height - (3 * game.textSize), false, 2 * game.textSize));
      utility.cost[12] = utility.newPrice(utility.cost[12], utility.costFactor[12], utility.level[12]);
      utility.event = null;
      break;
      case "containerFill":
      clickEffect.push(new Effects(utility.convert(utility.cost[13]), game.width / 2, game.height - (3 * game.textSize), false, 2 * game.textSize));
      utility.cost[13] = utility.checkMark;
      utility.event = null;
      break;
      case "containerSell":
      clickEffect.push(new Effects(utility.convert(utility.cost[14]), game.width / 2, game.height - (3 * game.textSize), false, 2 * game.textSize));
      utility.cost[14] = utility.checkMark;
      utility.event = null;
      break;
      case "explodeFrenzy":
      clickEffect.push(new Effects(utility.convert(utility.cost[15]), game.width / 2, game.height - (3 * game.textSize), false, 2 * game.textSize));
      utility.cost[15] = utility.checkMark;
      utility.event = null;
      break;
    }
  };
  setPrestige() { // prestige sequence
    this.prestige += this.prestigeFor;
    this.money = 0;
    this.level = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.cost = [20, 250, 600, 900, 5000, 5500, 6200, 15000, 5000, 50000, 1500, 5000, 10000, 100000, 5000, 100000];
    this.earned = 0;
    cookie.pulse = 25;
    player.earnedThen = 0;
    player.earnedNow = 0;
    player.update();
    utility = new Utility;
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
    if ((utility.time - input.lastClick) > utility.rollTime) {
      utility.clickCount = 0;
    };
    if (utility.occuring > 0) { // if an event is occuring
      utility.events();
      utility.occuring--;
      utility.occuring--;
    };
  };
};

class Cookie {
  constructor() {
    this.x = (game.width / 2);
    this.y = (game.height / 2);
    this.r = (this.radius());
    this.pulseCount = 0;
    this.pulse = 25 + (utility.level[3] * 5);
    this.worth = Math.floor(((1 + utility.level[0] * (1 + utility.clickCount)) * utility.multiplier) * utility.prestigeBonus);
    this.bonusWorth = Math.floor((((1 + utility.level[2]) * this.worth * (1 + utility.clickCount)) * utility.multiplier) * utility.prestigeBonus);
    this.goldWorth = Math.ceil(((this.bonusWorth * (1 + utility.clickCount)) * utility.multiplier) * utility.prestigeBonus);
    this.expCookie = [];
    this.exploding = false;
    this.explode = 0;
    this.explodeFor = 120;
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
    //this.clicked = false;
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
  expand() {
    if (cookie.r + cookie.pulseCount < cookie.r * 3) cookie.pulseCount += cookie.pulse;
    utility.money += cookie.worth;
    utility.earned += cookie.worth;
    utility.event = "click";
    utility.occuring = 100;
  };
  reset() {
    if (utility.explodable) {
      utility.event = "reset";
      utility.occuring = 100;
      cookie.pulseCount = cookie.pulse;
      utility.money += cookie.bonusWorth;
      utility.earned += cookie.bonusWorth;
      utility.explode();
      if (utility.inFrenzy) {
        cookie.frenzy();
      };
    } else {
      utility.money += cookie.worth;
      utility.earned += cookie.worth;
      utility.event = "click";
      utility.occuring = 100;
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
    // turn off the explode
    if (this.explode > 0) {
      this.explode--;
    }
    if (this.explode == 0) {
      this.exploding = false;
      this.expCookie = [];
    }
  };
  frenzy() {
    utility.event = "frenzy";
    utility.occuring = 100;
    utility.money += 5 * cookie.bonusWorth;
    utility.earned += 5 * cookie.bonusWorth;
  };
  goldReset() {
    cookie.reset();
    utility.money += this.goldWorth;
    utility.earned += this.goldWorth;
    utility.event = "goldCookie";
    utility.occuring = 100;
    goldCookie.gold = false;
    //goldCookie.clicked = true;
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
    this.worth = Math.floor(((1 + utility.level[0] * (1 + utility.clickCount)) * utility.multiplier) * utility.prestigeBonus);
    this.bonusWorth = Math.floor((((1 + utility.level[2]) * this.worth * (1 + utility.clickCount)) * utility.multiplier) * utility.prestigeBonus);
    this.goldWorth = Math.ceil(((this.bonusWorth * (1 + utility.clickCount)) * utility.multiplier) * utility.prestigeBonus);
    // deflate the cookie
    if (cookie.pulseCount > 0) {
      cookie.pulseCount--;
      if (latestTime > input.lastClick + (1500)) {
        cookie.pulseCount -= 2; // cookie deflates faster after 1.5 seconds
      };
    };
    // explode cookie
    if (cookie.exploding) {
      cookie.boom(cookie, 2);
      utility.events(cookie.bonusWorth, 0, 0, true);
      this.expCookie.forEach(function(c) {
        //console.log(c);
        if (c.x + c.xV < (-game.width * 4) || c.x + c.xV > (game.width * 4)) cookie.expCookie.splice(0,1);
        if (c.y + c.yV < (-game.height * 4) || c.y + c.yV > (game.height * 4)) cookie.expCookie.splice(0,1);
      });
    };
    if (goldCookie.goldCount < 0) { // if the gold cookie should disappear
      goldCookie.gold = false;
    };
    if (goldCookie.exploding) {
      goldCookie.boom(goldCookie, 3);
      utility.events(cookie.goldWorth, 0, 0, true);
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
  constructor(column, row, level) {
    this.column = column;
    this.row = row;
    this.level = level;
    this.x = 20; // x position of container area
    this.y = game.height - game.textSize - 10; // y position of container area
    this.type = ["None", "Jar", "Box", "Basket", "Sack", "Pallet", "Container"];
    this.reduceCap = utility.level[11];
    this.capacity = (utility.level[10] * 15) - this.reduceCap;
    this.bonus = 1 + (utility.level[12] * 5);
    this.worth = (cookie.worth * ((utility.level[10] * 15) + this.bonus)) * utility.multiplier;
    this.filled = 0;
    this.full = false;
    this.sin = 0;
    this.sinSwitch = false;
    this.increasing = false;
    this.selling = false;
  };
  draw() {
    if (this.full) {
      ctxD.globalAlpha = this.sin;
      ctxD.fillStyle = "white";
      ctxD.fillRect(this.x - 15, this.y - 15, game.width - 40 + 30, game.textSize + 30);
      ctxD.globalAlpha = "1";
    };
    // the background
    if (utility.level[10] > 0) {
      ctxD.fillStyle = "white";
      ctxD.fillRect(this.x, this.y, game.width - 40, game.textSize);
      if (this.filled > 0) {
        ctxD.fillStyle = "green";
        ctxD.fillRect(this.x, this.y, (this.filled / this.capacity) * game.width - 40 , game.textSize);
      }
    };
    ctxD.drawImage( // the container image
      texture, // the texture sheet
      this.column * game.frameW, // starting x
      this.row * game.frameH, // starting y
      game.frameW, // width
      game.frameH, // height
      (game.width / 2) - (game.frameW / 2), // destination x
      this.y - 5, // destination y
      game.frameW, // drawn width
      game.frameH // drawn height
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
    if (utility.level[10] > 0 && this.filled < this.capacity) {
      this.filled++;
    }
  };
  sell() {
    if (this.full) {
      utility.occuring = 100;
      clickEffect.push(new Effects(utility.convert(container.worth), game.width / 2, 3 * game.textSize, true, (game.textSize / 1.5) + clickEffect.length));
      utility.money += this.worth + this.bonus;
      utility.earned += this.worth + this.bonus;
      this.filled = 0;
      this.full = false;
    };
  };
  update() {
    this.level = utility.level[10];
    this.column = this.level;
    this.reduceCap = utility.level[11];
    this.capacity = (utility.level[10] * 15) - this.reduceCap;
    this.bonus = (utility.level[12] * 5)* utility.prestigeBonus;
    this.worth = (cookie.worth * ((utility.level[10] * 15) + this.bonus)) * utility.multiplier;
    if (this.filled >= this.capacity) {
      this.full = true;
    };
    if (utility.level[14] > 0) {
      if (this.full) this.sell();
    };
    if (utility.level[14] < 1) {
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
  constructor(text, x, y, type, size) {
    this.text = text;
    this.x = x;
    this.y = game.height - game.textSize - y;
    this.font = size + "px calibri";
    this.type = type;
    this.time = 1;
  };
};

class Button {
  constructor(column, row) {
    this.width = game.frameW;
    this.height = game.frameH;
    this.column = column;
    this.row = row;
    this.x = game.textSize;
    if (game.textSize < 100) {
      this.size = 50;
    } else {
      this.size = 100;
    };
    this.xText = 10;
    this.xPrice = 2 * game.textSize;
  };
  draw(y) {
    // the button box
    this.y = (1.1 * game.textSize * y) + (1.33 * game.textSize);
    ctxD.imageSmoothingEnabled = true;
    ctxD.imageSmoothingQuality = "high";
    if (utility.cost[this.column] <= utility.money) {
      // the button background
      ctxD.fillStyle = "hsl(105, 100%, 50%)";
      ctxD.fillRect(this.x, this.y - input.dY, game.width - (2 * game.textSize), this.size);
      ctxD.drawImage(
        texture, // the texture sheet
        this.column * game.frameW, // starting x
        this.row * game.frameH, // starting y
        game.frameW, // width
        game.frameH, // height
        this.x, // destination x
        this.y - input.dY, // destination y
        this.size, // drawn width
        this.size // drawn height
      );
    } else {
      // the button background
      ctxD.fillStyle = "lightgrey";
      ctxD.fillRect(this.x, this.y - input.dY, game.width - (2 * game.textSize), this.size);
      ctxD.drawImage(
        texture, // the texture sheet
        this.column * game.frameW, // starting x
        1 * game.frameH, // starting y
        game.frameW, // width
        game.frameH, // height
        this.x, // destination x
        this.y - input.dY, // destination y
        this.size, // drawn width
        this.size // drawn height
      );
    };
  };
  drawText(level, price, y, description) {
    this.yText = (1.1 * game.textSize * y) + (1.33 * game.textSize);
    // the button level
    ctxD.fillStyle = "black";
    ctxD.textAlign = "left";
    ctxD.textBaseline = "top";
    ctxD.font = (game.textSize * 0.5) + "px calibri";
    ctxD.fillText(level, this.xText, this.yText + (game.textSize / 6) - input.dY);
    // the button price
    ctxD.fillStyle = "black";
    ctxD.textAlign = "left";
    ctxD.textBaseline = "top";
    ctxD.font = (game.textSize * 0.4) + "px calibri";
    ctxD.fillText("$" + price, this.xPrice, this.yText - input.dY);
    // the button description
    ctxD.font = (game.textSize * 0.4) + "px calibri";
    ctxD.fillText(description, this.xPrice, this.yText + (game.textSize / 2) - input.dY);
  };
  update() {
    if (btn1.y - input.dY > btn1.y) {
      input.dY += 2;
      if (btn1.y - input.dY > (1.15 * btn1.y)) {
        input.dY += 10;
      };
      if (btn1.y - input.dY > (4 * btn1.y)) {
        input.dY += 50;
      };
    };
    if (btn16.y - input.dY < (game.height - (2.3 * game.textSize))) {
      input.dY -= 2;
      if (btn16.y - input.dY < (game.height - (2.5 * game.textSize))) {
        input.dY -= 10;
      };
      if (btn16.y - input.dY < (game.height - (6 * game.textSize))) {
        input.dY -= 50;
      };
    };
  }; // end update
};

let game = new Game;
let input = new InputHandler;
let utility = new Utility;
let btn1 = new Button(0, 2); // cookie money
let btn2 = new Button(1, 2); // explode cookie
let btn3 = new Button(2, 2); // explode bonus
let btn4 = new Button(3, 2); // clicks to explode
let btn5 = new Button(4, 2); // rolling bonus
let btn6 = new Button(5, 2); // increase rolling time
let btn7 = new Button(6, 2); // increase max rolling bonus
let btn8 = new Button(7, 2); // earnings multiplier
let btn9 = new Button(8, 2); // auto click
let btn10 = new Button(9, 2); // golden cookie
let btn11 = new Button(10, 2); // container level
let btn12 = new Button(11, 2); // smaller containers
let btn13 = new Button(12, 2); // increase container worth
let btn14 = new Button(13, 2); // auto click container
let btn15 = new Button(14, 2); // auto sell container
let btn16 = new Button(15, 2); // explode frenzy
let cookie = new Cookie;
let goldCookie = new Cookie;
let player = new Player;
let container = new Container(utility.level[10], 3, utility.level[10]);

then = Date.now();
game.loop();
