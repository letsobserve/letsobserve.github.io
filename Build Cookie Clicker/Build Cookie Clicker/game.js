const canvStat = document.getElementById("gameStatic");
const canvDyn = document.getElementById("gameDynamic");
const ctxS = canvStat.getContext("2d");
const ctxD = canvDyn.getContext("2d");
const texture = document.getElementById("textureSheet");
const dimension = [document.documentElement.clientWidth, document.documentElement.clientHeight];
canvStat.width = dimension[0];
canvStat.height = dimension[1];
canvDyn.width = dimension[0];
canvDyn.height = dimension[1];

let lastTime = 0;
let now = new Date();
let time = now.getTime();
let expireTime = time + (365 * 24 * 60 * 60);
let latestTime;
let clickEffect = [];
let xDown = null;
let yDown = null;
let lastPlayed = new Date();
lastPlayed.setTime(localStorage.getItem("playerLatestTime"));

class Game {
  constructor() {
    this.width = dimension[0];
    this.height = dimension[1];
    this.frameW = 120;
    this.frameH = 120;
    // state the game is
    // 0 = Start menu, 1 = Cookie screen, 2 = Shop, 3 = Prestige, 4 = add 3rd screen
    this.states = [0, 1, 2, 3, 4];
    this.state = 0;
    if (this.width > this.height) {
      this.textSize = this.frameW / 2;
    } else {
      this.textSize = this.frameW;
    };
    this.time = new Date();
  };
  draw0() {
    ctxS.fillStyle = "hsl(195, 50%, 70%)";
    ctxS.fillRect(0, 0, this.width, this.height);
    ctxS.imageSmoothingEnabled = true;
    ctxS.imageSmoothingQuality = "high";
    ctxS.drawImage(
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
    ctxS.fillStyle = "black";
    ctxS.textAlign = "center";
    ctxS.textBaseline = "middle";
    ctxS.font = "small-caps bolder " + 2 * this.textSize + "px calibri";
    ctxS.fillText("Cookie", game.width / 2, 3 * game.textSize);
    ctxS.fillText("Frenzy", game.width / 2, 5 * game.textSize);
    ctxS.fillStyle = "white";
    ctxS.fillRect(2 * game.frameW, game.height / 2, 4 * game.frameW, 1.5 * game.frameH);
    ctxS.fillRect(2 * game.frameW, game.height / 1.5, 4 * game.frameW, 1.5 * game.frameH);
    ctxS.fillStyle = "black";
    ctxS.textAlign = "left";
    ctxS.textBaseline = "top";
    ctxS.font = this.textSize + "px calibri";
    ctxS.fillText("Play", 2 * game.frameW + game.textSize, game.height / 2 + (game.textSize / 4));
    ctxS.fillText("Exit", 2 * game.frameW + game.textSize, game.height / 1.5 + (game.textSize / 4));
  };
  draw1() {
    // background
    ctxS.fillStyle = "hsl(195, 50%, 70%)";
    ctxS.fillRect(0, 0, this.width, this.height);
    // money area
    ctxS.fillStyle = "white";
    ctxS.strokeStyle = "black";
    ctxS.lineWidth = 10;
    ctxS.fillRect(0, 0, this.width, 2 * this.textSize);
    ctxS.strokeRect(0, 0, this.width, 2 * this.textSize);
    ctxS.fillStyle = "black";
    ctxS.textAlign = "center";
    ctxS.textBaseline = "top";
    ctxS.font = this.textSize / 1.5 + "px calibri";
    ctxS.globalAlpha = 0.5;
    ctxS.fillText("Shop", this.width / 2, game.textSize + 10);
    ctxS.textAlign = "right";
    ctxS.fillText("Prestige", this.width - 10, game.textSize + 10);
    ctxS.textAlign = "left";
    ctxS.fillText("Third", 10, game.textSize + 10);
    ctxS.globalAlpha = 1;
    if (utility.level[9] > 0) {
      if (container.full) {
        ctxD.fillStyle = "green";
      } else {
        ctxD.fillStyle = "white";
      }
      ctxD.fillRect(game.width - (3 * game.textSize), game.height - (2 * game.textSize) - 10, this.width, this.height);
    };
    // draw the cookie
    cookie.draw(cookie.x, cookie.xV, cookie.y, cookie.yV, cookie.r, cookie.pulseCount, cookie.color(), 0);
    // draw the rest of the cookie screen
    if (utility.level[9] > 0) container.draw();
    utility.drawD();
    // draw golden cookie
    if (goldCookie.gold && !utility.upgrading) {
      goldCookie.draw(goldCookie.rX, 0, goldCookie.rY, 0, goldCookie.rR, 0, 3, 0);
      goldCookie.goldCount--;
    };
  };
  update() {
    // count time between clicks
    if ((utility.time - input.lastClick) > utility.rollTime) {
      utility.clickCount = 0;
    };
    if (utility.occuring > 0) {
      utility.events();
      utility.occuring--;
      utility.occuring--;
    };
    if (goldCookie.goldCount < 0) {
      goldCookie.gold = false;
    };
  };
  loop(now) {
    utility.time = new Date().getTime();
    // clear canvas
    ctxS.clearRect(0, 0, game.width, game.height);
    ctxD.clearRect(0, 0, game.width, game.height);
    // update the game parameter
    game.update();
    cookie.update();
    container.update();
    btn1.update();
    player.update();
    // auto click occasionally
    if (!lastTime || now - lastTime >= (2000 - utility.tapRate)) {
      lastTime = now;
      utility.update();
    };
    if (game.state == 0) { // draw the start menu
      game.draw0();
    } else if (game.state == 1) { // draw the cookie screen
      game.draw1();
      utility.drawD();
    } else if (game.state == 2) { // draw the shop screen
      // draw the menu
      utility.drawM();
    } else if (game.state == 3) { // draw the prestige screen

    } else { // draw the third menu screen

    }
    // loop
    requestAnimationFrame(game.loop);
  };
};

class InputHandler {
  constructor() {
    this.dY = 0;
    this.dX = 0;
    this.lastClick = 0;
    document.addEventListener("click", (e) => {
      if (game.state == 0) {
        if (e.x > 2 * game.frameW && e.x < (2 * game.frameW) + (4 * game.frameW) && e.y > game.height / 2 && e.y < (game.height / 2) + (1.5 * game.frameW)) {
          game.state = 1;
        } else if (e.x > 2 * game.frameW && e.x < (2 * game.frameW) + (4 * game.frameW) && e.y > game.height / 1.5 && e.y < (game.height / 1.5) + (1.5 * game.frameW)) {
          window.history.go(-1);
          console.log("test");
        };
      } else if (game.state == 1) {
        // check if in the cookie
//        if ((Math.pow(e.x - cookie.x, 2) + Math.pow(e.y - cookie.y, 2)) < Math.pow(cookie.r + cookie.pulseCount, 2)) {
          // note the time
//          this.lastClick = utility.time;
          // check if click count should increase
//          if (utility.rolling && utility.clickCount < utility.maxClickCount) utility.clickCount++;
          // if cookie should expand
//          if (cookie.r + cookie.pulseCount < cookie.r * 3) {
//            cookie.expand();
//            container.fill();
//          } else {
//            cookie.reset();
//            container.fill();
//          };
//        };
        // check if inside golden cookie
        if (goldCookie.gold && (Math.pow(e.x - goldCookie.rX, 2) + Math.pow(e.y - goldCookie.rY, 2)) < Math.pow(goldCookie.rR, 2)) {
          goldCookie.goldReset();
        };
        // check if money was clicked
          if (e.x > game.width / 3 && e.x < game.width - (game.width / 3) && e.y < 2 * game.textSize) {
            game.state = 2;
          };
          if (e.x > game.width - (game.width / 3) && e.y < 2 * game.textSize) {
            //game.state = 3;
            console.log("prestige");
          };
          if (e.x < game.textSize && e.y < 2 * game.textSize) {
            //game.state = 4;
            console.log("third");
          };
        //check if jar is tapped
        if (utility.level[9] > 0 && yDown > game.height - (3 * game.textSize) && xDown > game.width - (3 * game.textSize)) {
          container.sell();
        };
      } else if (game.state == 2) {
        if (e.x < game.width && e.y < 2 * game.textSize) {
          console.log("testing");
          utility.level = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        };
          if (e.x < game.width && e.y > game.height - game.textSize) {
            game.state = 1;
          }
          // check if in upgrade button area
          if (e.x > btn1.x && e.x < (btn1.x + btn1.size)) {
            // check each button
            // max level && can afford? && position
            if (utility.level[0] < 500 && utility.cost[0] <= utility.money && e.y > btn1.y - input.dY && e.y < btn1.y + game.frameH - input.dY) {
              console.log("1");
              utility.upgrade(utility.cost[0], 0, "extraMoney");
            };
            if (utility.level[1] == 0 && utility.cost[1] <= utility.money && e.y > btn2.y - input.dY && e.y < btn2.y + game.frameH - input.dY) {
              console.log("2");
              utility.upgrade(utility.cost[1], 1, "explodable");
            };
            if (utility.level[2] < 100 && utility.cost[2] <= utility.money && e.y > btn3.y - input.dY && e.y < btn3.y + game.frameH - input.dY) {
              console.log("3");
              utility.upgrade(utility.cost[2], 2, "explodeBonus");
            };
            if (utility.level[3] < 100 && utility.cost[3] <= utility.money && e.y > btn4.y - input.dY && e.y < btn4.y + game.frameH - input.dY) {
              console.log("4");
              utility.upgrade(utility.cost[3], 3, "explodeMore");
            };
            if (utility.level[4] == 0 && utility.cost[4] <= utility.money && e.y > btn5.y - input.dY && e.y < btn5.y + game.frameH - input.dY) {
              console.log("5");
              utility.upgrade(utility.cost[4], 4, "rolling");
            };
            if (utility.level[5] < 50 && utility.cost[5] <= utility.money && e.y > btn6.y - input.dY && e.y < btn6.y + game.frameH - input.dY) {
              console.log("6");
              utility.upgrade(utility.cost[5], 5, "rollingDur");
            };
            if (utility.level[6] < 200 && utility.cost[6] <= utility.money && e.y > btn7.y - input.dY && e.y < btn7.y + game.frameH - input.dY) {
              console.log("7");
              utility.upgrade(utility.cost[6], 6, "rollingMax");
            };
            if (utility.level[7] < 99 && utility.cost[7] <= utility.money && e.y > btn8.y - input.dY && e.y < btn8.y + game.frameH - input.dY) {
              console.log("8");
              utility.upgrade(utility.cost[7], 7, "multiplier");
            };
            if (utility.level[8] < 40 && utility.cost[8] <= utility.money && e.y > btn9.y - input.dY && e.y < btn9.y + game.frameH - input.dY) {
              console.log("9");
              console.log(utility.tapRate);
              utility.upgrade(utility.cost[8], 8, "autoClick");
            };
            if (utility.level[9] == 0 && utility.cost[9] <= utility.money && e.y > btn10.y - input.dY && e.y < btn10.y + game.frameH - input.dY) {
              console.log("10");
              utility.upgrade(utility.cost[9], 9, "golden");
            };
            if (utility.level[10] < 5 && utility.cost[10] <= utility.money && e.y > btn11.y - input.dY && e.y < btn11.y + game.frameH - input.dY) {
              console.log("11");
              utility.upgrade(utility.cost[10], 10, "containerLvl");
            };
            if (utility.level[10] > 0 && utility.level[11] < 100 && utility.cost[11] <= utility.money && e.y > btn12.y - input.dY && e.y < btn12.y + game.frameH - input.dY) {
              console.log("12");
              utility.upgrade(utility.cost[11], 11, "containerCap");
            };
            if (utility.level[10] > 0 && utility.level[12] == 0 && utility.cost[12] <= utility.money && e.y > btn13.y - input.dY && e.y < btn13.y + game.frameH - input.dY) {
              console.log("13");
              utility.upgrade(utility.cost[12], 12, "containerWorth");
            };
            if (utility.level[10] > 0 && utility.level[13] == 0 && utility.cost[13] <= utility.money && e.y > btn14.y - input.dY && e.y < btn14.y + game.frameH - input.dY) {
              console.log("14");
              utility.upgrade(utility.cost[13], 13, "containerFill");
            };
            if (utility.level[10] > 0 && utility.level[14] == 0 && utility.cost[14] <= utility.money && e.y > btn15.y - input.dY && e.y < btn15.y + game.frameH - input.dY) {
              console.log("15");
              utility.upgrade(utility.cost[14], 14, "containerSell");
            };
            if (utility.level[15] == 0 && utility.cost[15] <= utility.money && e.y > btn16.y - input.dY && e.y < btn16.y + game.frameH - input.dY) {
              console.log("16");
              utility.upgrade(utility.cost[15], 15, "explodeFrenzy");
            };
          };
      } else if (game.state == 3) {

      } else {

      }
    });
    document.addEventListener("touchstart", (e) => {
      e.preventDefault();
      const firstTouch = e.touches[0];
      const ongoingTouches = [];
      xDown = firstTouch.clientX;
      yDown = firstTouch.clientY;
      for (let i = 0; i < e.touches.length; i++) {
        ongoingTouches.push(e.targetTouches[i]);
        // check if in the cookie
        if ((Math.pow(ongoingTouches[i].clientX - cookie.x, 2) + Math.pow(ongoingTouches[i].clientY - cookie.y, 2)) < Math.pow(cookie.r + cookie.pulseCount, 2)) {
          // note the time
          this.lastClick = utility.time;
          // check if click count should increase
          if (utility.rolling && utility.clickCount < utility.maxClickCount) utility.clickCount++;
          // if cookie should expand
          if (cookie.r + cookie.pulseCount < cookie.r * 3) {
            cookie.expand();
            container.fill();
          } else {
            cookie.reset();
            container.fill();
          };
        };
      };
    });
    document.addEventListener("touchmove", (e) => {
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
    window.addEventListener("resize", (e) => {
      location.reload();
    });
  };
};

class Player {
  constructor() {
    this.getMoney = parseInt(localStorage.getItem("playerMoney"));
    this.money = utility.money;
  };
  update() {
    // set up a save function
    localStorage.setItem("playerMoney", utility.money);
    localStorage.setItem("playerUpgrades", utility.level);
    localStorage.setItem("playerLatestTime", latestTime);
    // convert money to 6 sig. fig.
    this.money = utility.money;
    if (this.money > 1000000) {
      this.money = this.money.toExponential(3);
    };
  };
};

class Utility {
  constructor() {
    this.time = 0;
    this.clickCount = 0;
    this.maxClickCount = 25;
    // get the stored money value
    this.money = parseInt(localStorage.getItem("playerMoney"));
    if (!Number.isInteger(this.money)) {
      this.money = 0;
    }
    // get the stored upgrade values
    this.level = [];
    try {
      this.getLevel = localStorage.getItem("playerUpgrades").split(",");
      console.log(this.getLevel);
      if (this.getLevel.length < 16) { // if less than all upgrades
        // include new upgrades
      }

      for (let i = 0; i < this.getLevel.length; i++) {
        this.level.push(parseInt(this.getLevel[i]));
        btn1
      };
    } catch {
      this.level = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    };
    // set the price according to levels
    this.costFactor = [1.5, 0, 2.35, 5, 0, 1.37, 10, 2.37, 3.33, 0, 15, 4, 5, 0, 0, 0];
    this.cost = [20, 500, 1000, 7500, 1000, 7500, 50000, 1000, 10000, 500, 1500, 5000, 10000, 100000, 5000, 1000000];
    // testing purposes
    // this.cost = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

    // 0 = increase money per click, 1 = cookie explodable
    // 2 = increase bonus money, 3 = less clicks to explode
    // 4 = rolling multiplier, 5 = increase rolling duration
    // 6 = increase rolling max, 7 = overall multiplier,
    // 8 = auto click, 9 = unlock golden cookies
    // 10 = level up container, 11 = less cookies to fill container
    // 12 = increase container worth, 13 = auto clicks pack containers
    // 14 = auto sell containers, 15 = unlock cookie explode frenzy

    this.event = null;
    this.occuring = 0;
    this.upArrow = "\u21D1";
    this.downArrow = "\u21D3";
    this.checkMark = "\uD83D\uDDF9";
    this.switch = false;
    // upgrade variables
    if (this.level[1] > 0) {
      this.explodable = true;
    } else {
      this.explodable = false;
    };
    if (this.level[4] > 0) {
      this.rolling = true;
    } else {
      this.rolling = false;
    };

    this.rollTime = 1000;
    if (this.level[9] > 0) {
      this.goldable = true;
    } else {
      this.goldable = false;
    };
    this.multiplier = this.level[7];
    if (this.level[8] > 0) {
      this.autoTap = true;
    } else {
      this.autoTap = false;
    };
    this.tapRate = 0;
  };
  drawD() {
    // draw the earned money
    for (let i = 0; i < clickEffect.length; i++) {
      if (clickEffect[i].time > 0) {
        if (clickEffect[i].type) {
          ctxD.fillStyle = "green";
          ctxD.textAlign = "center";
          ctxD.font = (game.textSize / 2) + "px calibri";
          ctxD.fillText("$" + clickEffect[i].text, clickEffect[i].x, clickEffect[i].y + clickEffect[i].time);
        } else {
          ctxD.fillStyle = "red";
          ctxD.textAlign = "center";
          ctxD.font = game.textSize + "px calibri";
          ctxD.fillText("-$" + clickEffect[i].text, clickEffect[i].x, clickEffect[i].y + clickEffect[i].time);
        }
        clickEffect[i].time -= clickEffect.length;
      } else {
        clickEffect.splice(0, 1);
      }
    };
    // draw the money
    ctxD.fillStyle = "black";
    ctxD.textAlign = "center";
    ctxD.textBaseline = "top";
    ctxD.font = game.textSize + "px calibri";
    ctxD.fillText("$" + player.money, game.width / 2, 5);
    // draw the rolling multiplier
    if (this.rolling) {
      var txt = game.textSize;
      // bounding ellipse
      ctxD.fillStyle = "white";
      ctxD.strokeStyle = "black";
      ctxD.beginPath();
      ctxD.ellipse(
        game.width - 100, // x
        2 * txt + 50, // y
        txt / 1.5, // radius x
        txt / 3, // radius y
        0, // rotation
        0, // start angle
        2 * Math.PI // end angle
      );
      ctxD.closePath();
      ctxD.fill();
      ctxD.stroke();
      // slow filling timer
      if (input.lastClick > this.rollTime && this.clickCount > 0) {
        ctxD.globalAlpha = ((this.time - input.lastClick) / this.rollTime);
        ctxD.fillStyle = "rgb(255,0,0)";
        ctxD.beginPath();
        ctxD.ellipse(
          game.width - 100, // x
          2 * txt + 50, // y
          ((this.time - input.lastClick) / this.rollTime) * (txt / 1.5) % (txt / 1.5), // radius x
          txt / 3, // radius y
          0, // rotation
          0, // start angle
          2 * Math.PI // end angle
        );
        ctxD.closePath();
        ctxD.fill();
      };
      // counter
      ctxD.globalAlpha = 1;
      ctxD.fillStyle = "black";
      ctxD.strokeStyle = "darkgrey";
      ctxD.textAlign = "right";
      ctxD.textBaseline = "middle";
      ctxD.font = (txt * 0.35) + "px calibri";
      ctxD.lineWidth = 10;
      ctxD.strokeText("x" + this.clickCount, game.width - 100 + (txt / 4), 2 * txt + 51);
      ctxD.lineWidth = 5;
      ctxD.fillText("x" + this.clickCount, game.width - 100 + (txt / 4), 2 * txt + 51);
    };
  };
  drawM() {
    // draw the upgrade screen
      // background
      ctxD.fillStyle = "white";
      ctxD.strokeStyle = "black";
      ctxD.lineWidth = 10;
      ctxD.fillRect(0, 0, game.width, game.height);
      // the buttons
      btn1.draw(1, 1, 100);
      btn2.draw(2, 2, 100);
      btn3.draw(3, 3, 100);
      btn4.draw(4, 4, 100);
      btn5.draw(5, 5, 100);
      btn6.draw(6, 6, 100);
      btn7.draw(7, 7, 100);
      btn8.draw(8, 8, 100);
      btn9.draw(9, 9, 100);
      btn10.draw(10, 10, 100);
      btn11.draw(11, 11, 100);
      btn12.draw(12, 12, 100);
      btn13.draw(13, 13, 100);
      btn14.draw(14, 14, 100);
      btn15.draw(15, 15, 100);
      btn16.draw(16, 16, 100);
      // the button text
      btn1.drawText(utility.level[0], utility.convert(utility.cost[0]), 1, 1, "More money per cookie");
      btn2.drawText(utility.level[1], utility.convert(utility.cost[1]), 2, 2, "Exploding cookie");
      if (utility.level[1] > 0) {
        btn3.drawText(utility.level[2], utility.convert(utility.cost[2]), 3, 3, "Increase explode bonus");
        btn4.drawText(utility.level[3], utility.convert(utility.cost[3]), 4, 4, "Decrease clicks to explode");
      } else {
        btn3.drawText(utility.level[2], utility.convert(utility.cost[2]), 3, 3, "Requires Exploding cookie");
        btn4.drawText(utility.level[3], utility.convert(utility.cost[3]), 4, 4, "Requires Exploding cookie");
      };
      btn5.drawText(utility.level[4], utility.convert(utility.cost[4]), 5, 5, "Rolling clicks bonus");
      if (utility.level[4] > 0) {
        btn6.drawText(utility.level[5], utility.convert(utility.cost[5]), 6, 6, "Increase rolling click duration");
        btn7.drawText(utility.level[6], utility.convert(utility.cost[6]), 7, 7, "Increase max rolling bonus");
      } else {
        btn6.drawText(utility.level[5], utility.convert(utility.cost[5]), 6, 6, "Requires Rolling clicks bonus");
        btn7.drawText(utility.level[6], utility.convert(utility.cost[6]), 7, 7, "Requires Rolling clicks bonus");
      };
      btn8.drawText(utility.level[7], utility.convert(utility.cost[7]), 8, 8, "Overall multiplier");
      btn9.drawText(utility.level[8], utility.convert(utility.cost[8]), 9, 9, "Auto clicking cookie");
      btn10.drawText(utility.level[9], utility.convert(utility.cost[9]), 10, 10, "Unlock golden cookies");
      if (utility.level[10] > 0) {
        btn11.drawText(utility.level[10], utility.convert(utility.cost[10]), 11, 11, "Increase container level");
        btn12.drawText(utility.level[11], utility.convert(utility.cost[11]), 12, 12, "Decrease size of container");
        btn13.drawText(utility.level[12], utility.convert(utility.cost[12]), 13, 13, "Increase the sell price of containers");
        btn14.drawText(utility.level[13], utility.convert(utility.cost[13]), 14, 14, "Auto clicks now fill up containers");
        btn15.drawText(utility.level[14], utility.convert(utility.cost[14]), 15, 15, "Auto sells your full containers");
      } else {
        btn11.drawText(utility.level[10], utility.convert(utility.cost[10]), 11, 11, "Unlock containers");
        btn12.drawText(utility.level[11], utility.convert(utility.cost[11]), 12, 12, "Requires Unlock containers");
        btn13.drawText(utility.level[12], utility.convert(utility.cost[12]), 13, 13, "Requires Unlock containers");
        btn14.drawText(utility.level[13], utility.convert(utility.cost[13]), 14, 14, "Requires Unlock containers");
        btn15.drawText(utility.level[14], utility.convert(utility.cost[14]), 15, 15, "Requires Unlock containers");
      };
      btn16.drawText(utility.level[15], utility.convert(utility.cost[15]), 16, 16, "Unlock Explode Frenzy");
      // money area
      ctxD.fillStyle = "lightgrey";
      ctxD.fillRect(0, 0, game.width, 2 * game.textSize);
      ctxD.fillStyle = "black";
      ctxD.textAlign = "center";
      ctxD.textBaseline = "top";
      ctxD.font = game.textSize / 1.5 + "px calibri";
      ctxD.globalAlpha = 1;
      ctxD.fillText("Shop", game.width / 2, game.textSize + 10);
      ctxD.textAlign = "right";
      ctxD.globalAlpha = 0.5;
      ctxD.fillText("Prestige", game.width - 10, game.textSize + 10);
      ctxD.textAlign = "left";
      ctxD.fillText("Third", 10, game.textSize + 10);
      ctxD.globalAlpha = 1;
      // money
      ctxD.fillStyle = "black";
      ctxD.textAlign = "center";
      ctxD.textBaseline = "top";
      ctxD.font = game.textSize + "px calibri";
      ctxD.fillText("$" + player.money, game.width / 2, 5);
      ctxD.textAlign = "center";
      ctxD.fillStyle = "lightgrey";
      ctxD.fillRect(0, game.height - game.textSize, game.width, game.textSize);
      ctxD.fillStyle = "black";
      ctxD.fillText("Close Shop", game.width / 2, game.height - game.textSize);
      ctxD.strokeRect(0, game.height - game.textSize, game.width, game.height);
  };
  explode() {
    cookie.exploding = true;
    cookie.explode = cookie.explodeFor;
    for (var i = 0; i < 25; i++) {
      cookie.expCookie[i] = new Cookie;
    }
  };
  autoClick() {
    // note the time
    input.lastClick = utility.time;
    // check if click count should increase
    if (utility.rolling && utility.clickCount < utility.maxClickCount) utility.clickCount++;
    this.money += cookie.worth + 1;
    if (utility.level[12] > 0) container.fill();
    utility.event = "click";
    this.events();
    if (cookie.r + cookie.pulseCount < cookie.r * 5) {
      cookie.pulseCount += cookie.pulse;
    } else {
      // console.log("click me please!");
    }
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
      cookie.pulse++;
      break;
      case "rolling":
      // start counting time between clicks
      this.rolling = true;
      break;
      case "rollingDur":
      // more duration before expiry
      utility.rollTime += 500;
      break;
      case "rollingMax":
      // higher rolling count before stopping
      utility.maxClickCount += 5;
      break;
      case "multiplier":
      this.multiplier++;
      break;
      case "autoClick":
      this.autoTap = true;
      if (utility.tapRate < 1949) utility.tapRate += 50;
      break;
      case "golden":
      this.goldable = true;
      break;
      case "containerLvl":
      container.level++;
      break;
      case "containerCap":
      if (container.capacity[container.level] > container.level) {
        container.capacity[container.level] -= container.level;
      };
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
  // alternate positions
  alternate() {
    var choice = [];
    if (this.switch) {
      choice.push(game.width - (game.frameW / 2));
    } else {
      choice.push(game.frameW / 2);
    }
    this.switch = !this.switch;
    return choice;
  };
  // number converter
  convert(number) {
    if (number > 100000) {
      return number.toExponential(3);
    } else {
      return number;
    }
  };
  // get the integer
  parse(parameter) {
    return parseInt(parameter);
  };
  // handle new upgrade costs
  newPrice(price, level, factor) {
    return Math.floor(price * factor) * level;
  };
  // change numbers
  events() {
    switch (utility.event) {
      case "click":
      clickEffect.push(new Effects(utility.convert(cookie.worth + 1), this.alternate(), clickEffect.length, true));
      utility.event = null;
      break;
      case "reset":
      clickEffect.push(new Effects(utility.convert(cookie.bonusWorth), game.width / 2, clickEffect.length, true));
      utility.event = null;
      break;
      case "extraMoney":
      clickEffect.push(new Effects(utility.convert(utility.cost[0]), game.width / 2, clickEffect.length, false));
      utility.cost[0] = Math.floor(utility.cost[0] * 1.5);
      utility.event = null;
      break;
      case "explodable":
      clickEffect.push(new Effects(utility.convert(utility.cost[1]), game.width / 2, clickEffect.length, false));
      utility.cost[1] = utility.checkMark;
      utility.event = null;
      break;
      case "explodeBonus":
      clickEffect.push(new Effects(utility.convert(utility.cost[2]), game.width / 2, clickEffect.length, false));
      utility.cost[2] = Math.floor(utility.cost[2] * 2.35);
      utility.event = null;
      break;
      case "explodeMore":
      clickEffect.push(new Effects(utility.convert(utility.cost[3]), game.width / 2, clickEffect.length, false));
      utility.cost[3] = Math.floor(utility.cost[3] * 2.35);
      utility.event = null;
      break;
      case "rolling":
      clickEffect.push(new Effects(utility.convert(utility.cost[4]), game.width / 2, clickEffect.length, false));
      utility.cost[4] = utility.checkMark;
      utility.event = null;
      break;
      case "rollingDur":
      // more duration before expiry
      clickEffect.push(new Effects(utility.convert(utility.cost[5]), game.width / 2, clickEffect.length, false));
      utility.cost[5] = Math.floor(utility.cost[5] * 4);
      utility.event = null;
      break;
      case "rollingMax":
      // higher rolling count before stopping
      clickEffect.push(new Effects(utility.convert(utility.cost[6]), game.width / 2, clickEffect.length, false));
      utility.maxClickCount += 5;
      utility.cost[6] = Math.floor(utility.cost[6] * 2.85);
      utility.event = null;
      break;
      case "multiplier":
      clickEffect.push(new Effects(utility.convert(utility.cost[7]), game.width / 2, clickEffect.length, false));
      utility.cost[7] = Math.floor(utility.cost[7] * 10);
      utility.event = null;
      break;
      case "autoClick":
      clickEffect.push(new Effects(utility.convert(utility.cost[8]), game.width / 2, clickEffect.length, false));
      utility.cost[8] = Math.floor(utility.cost[8] * 1.65);
      utility.event = null;
      break;
      case "golden":
      clickEffect.push(new Effects(utility.convert(utility.cost[9]), game.width / 2, clickEffect.length, false));
      utility.cost[9] = utility.checkMark;
      utility.event = null;
      break;
      case "goldCookie":
      clickEffect.push(new Effects(utility.convert(cookie.goldWorth), game.width / 2, clickEffect.length, true));
      utility.event = null;
      break;
      case "sell":
      clickEffect.push(new Effects(utility.convert(container.worth), game.width / 2, clickEffect.length, true));
      utility.event = null;
      console.log("test");
      break;
      case "containerLvl":
      clickEffect.push(new Effects(utility.convert(utility.cost[10]), game.width / 2, clickEffect.length, false));
      utility.cost[10] = Math.floor(utility.cost[10] * 10);
      utility.event = null;
      break;
      case "containerCap":
      clickEffect.push(new Effects(utility.convert(utility.cost[11]), game.width / 2, clickEffect.length, false));
      utility.cost[11] = Math.floor(utility.cost[11] * 6);
      utility.event = null;
      break;
      case "containerWorth":
      clickEffect.push(new Effects(utility.convert(utility.cost[12]), game.width / 2, clickEffect.length, false));
      utility.cost[12] = Math.floor(utility.cost[12] * 2.27);
      utility.event = null;
      break;
      case "containerFill":
      clickEffect.push(new Effects(utility.convert(utility.cost[13]), game.width / 2, clickEffect.length, false));
      utility.cost[13] = utility.checkMark;
      utility.event = null;
      break;
      case "containerSell":
      clickEffect.push(new Effects(utility.convert(utility.cost[14]), game.width / 2, clickEffect.length, false));
      utility.cost[14] = utility.checkMark;
      utility.event = null;
      break;
      case "explodeFrenzy":
      clickEffect.push(new Effects(utility.convert(utility.cost[15]), game.width / 2, clickEffect.length, false));
      utility.cost[15] = utility.checkMark;
      utility.event = null;
      break;
    }
  };
  update() {
    // tap if auto click is on
    if (this.autoTap) this.autoClick();
    latestTime = Date.now();
    console.log(game.time.getTime() - lastPlayed);
  };
};

class Cookie {
  constructor() {
    this.x = (game.width / 2);
    this.y = (game.height / 2);
    this.r = (this.radius());
    this.pulseCount = 0;
    this.pulse = 20;
    this.worth = (utility.level[0] * (utility.clickCount + 1)) * utility.multiplier;
    this.bonusWorth = ((this.worth + 1) * (utility.level[2] + 2)) * utility.multiplier;
    this.goldWorth = Math.floor(((this.worth + 1) * 500) * utility.multiplier);
    this.expCookie = [];
    this.exploding = false;
    this.explode = 0;
    this.explodeFor = 60;
    this.xV = 0;
    this.yV = 0;
    this.dX = Math.sin((Math.random() * (2 * Math.PI)));
    this.dY = Math.cos((Math.random() * (2 * Math.PI)));
    // golden cookie specifics
    this.rR = this.r / 6;
    this.rX = (Math.random() * (game.width - this.rR)) + this.rR;
    this.rY = (Math.random() * (game.height - this.rR)) + (game.textSize + this.rR);
    this.gold = false;
    this.goldCount = 0;
    this.clicked = false;
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
    cookie.pulseCount += cookie.pulse;
    utility.money += this.worth + 1;
    utility.event = "click";
    utility.occuring = 100;
  };
  reset() {
    if (utility.explodable) {
      utility.event = "reset";
      utility.occuring = 100;
      cookie.pulseCount = cookie.pulse;
      utility.money += (this.worth + 1) * (utility.level[2] + 2);
      utility.explode();
    } else {
      utility.money += this.worth + 1;
      utility.event = "click";
      utility.occuring = 100;
    };
  };
  boom(which, color) {
    // draw new cookies
    this.expCookie.forEach(function(c) {
      which.draw(c.x + (c.r / 3), c.xV, c.y + (c.r / 3), c.yV, c.r / 2, c.pulseCount, color, 0);
      // move cookies in random direction
      c.xV += c.dX * 20;
      c.yV += c.dY * 20;
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
  goldReset() {
    cookie.reset();
    utility.money += this.goldWorth;
    utility.event = "goldCookie";
    utility.occuring = 100;
    goldCookie.gold = false;
    goldCookie.clicked = true;
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
    this.worth = utility.level[0] * (utility.clickCount + 1);
    this.bonusWorth = (this.worth + 1) * (utility.level[2] + 2);
    this.goldWorth = Math.floor(((this.worth + 1) * 500) * utility.multiplier);
    // deflate the cookie
    if (cookie.pulseCount > 0) cookie.pulseCount--;
    // explode cookie
    if (cookie.exploding) {
      cookie.boom(cookie, 2);
      utility.events(cookie.bonusWorth, 0, 0, true);
    };
    if (goldCookie.exploding) {
      goldCookie.boom(goldCookie, 3);
      utility.events(this.goldWorth, 0, 0, true);
    };
    //  check if golden cookie should spawn
    if (utility.goldable && !utility.upgrading && goldCookie.explode <= 0 && !goldCookie.gold && Math.random() > 0.9) {
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
    this.type = ["None", "Jar", "Box", "Basket", "Sack", "Pallet", "Container"];
    this.capacity = [0, 15, 45, 80, 270, 4860, 97200];
    this.bonus = 0;
    this.worth = (2 * (this.capacity[this.level] + this.bonus)) * utility.multiplier;
    this.filled = 0;
    this.full = false;
    this.increasing = false;
    this.selling = false;
  };
  draw() {
    ctxD.drawImage(
      texture, // the texture sheet
      this.column * game.frameW, // starting x
      this.row * game.frameH, // starting y
      game.frameW, // width
      game.frameH, // height
      game.width - game.frameW - 10, // destination x
      game.height - game.frameH - 10, // destination y
      game.frameW, // drawn width
      game.frameH // drawn height
    );
    ctxD.fillStyle = "black";
    ctxD.strokeStyle = "white";
    ctxD.textAlign = "right";
    ctxD.textBaseline = "top";
    ctxD.font = game.textSize + "px calibri";
    // draw the name of the container
    ctxD.strokeText(this.type[this.level], game.width - game.textSize - 10, game.height - game.textSize);
    ctxD.fillText(this.type[this.level], game.width - game.textSize - 10, game.height - game.textSize);
    // draw the capacity of the container
    ctxD.strokeText(this.filled + "/" + this.capacity[this.level], game.width - 10, game.height - (2 * game.textSize));
    ctxD.fillText(this.filled + "/" + this.capacity[this.level], game.width - 10, game.height - (2 * game.textSize));
  };
  fill() {
    if (this.filled < this.capacity[this.level]) {
      this.filled++;
    }
  };
  sell() {
    if (this.full) {
      utility.event = "sell";
      utility.occuring = 100;
      utility.money += this.worth;
      this.filled = 0;
      this.full = false;
    } else {
      if (this.filled > 0) this.filled--;
    }
  };
  update() {
    this.worth = this.capacity[this.level] * utility.multiplier;
    if (this.filled < this.capacity[this.level]) {

    } else {
      this.full = true;
    };
    if (utility.level[13] > 0) {
      if (this.full) this.sell();
    }
  };
};

class Effects {
  constructor(text, x, y, type) {
    this.text = text;
    this.x = x;
    this.y = y + (2 * game.textSize);
    this.type = type;
    this.time = game.height / 2;
  };

};

class Button {
  constructor(column, row) {
    this.width = game.frameW;
    this.height = game.frameH;
    this.column = column;
    this.row = row;
    this.x = game.frameW;
    this.y = (1.2 * game.textSize * column) + (2.5 * game.textSize);
    this.xText = 10;
    this.yText = (1.2 * game.textSize * column) + (1.5 * game.textSize);
    this.xPrice = 2 * game.frameW;
  };
  draw(x, y, size) {
    // the button box
    this.size = size;
    ctxD.imageSmoothingEnabled = true;
    ctxD.imageSmoothingQuality = "high";
    if (utility.cost[this.column] <= utility.money) {
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
  drawText(level, price, x, y, description) {
    // the button level
    ctxD.fillStyle = "black";
    ctxD.textAlign = "left";
    ctxD.textBaseline = "top";
    ctxD.font = (game.textSize * 0.5) + "px calibri";
    ctxD.fillText(level, this.xText, this.yText + (game.frameH / 6) - input.dY  + game.textSize);
    // the button price
    ctxD.fillStyle = "black";
    ctxD.textAlign = "left";
    ctxD.textBaseline = "top";
    ctxD.font = (game.textSize * 0.4) + "px calibri";
    ctxD.fillText("$" + price, this.xPrice, this.yText - input.dY + game.textSize);
    // the button description
    ctxD.font = (game.textSize * 0.4) + "px calibri";
    ctxD.fillText(description, this.xPrice, this.yText + (game.frameH / 2) - input.dY + game.textSize);
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
let btn1 = new Button(0, 2);
let btn2 = new Button(1, 2);
let btn3 = new Button(2, 2);
let btn4 = new Button(3, 2);
let btn5 = new Button(4, 2);
let btn6 = new Button(5, 2);
let btn7 = new Button(6, 2);
let btn8 = new Button(7, 2);
let btn9 = new Button(8, 2);
let btn10 = new Button(9, 2);
let btn11 = new Button(10, 2);
let btn12 = new Button(11, 2);
let btn13 = new Button(12, 2);
let btn14 = new Button(13, 2);
let btn15 = new Button(14, 2);
let btn16 = new Button(15, 2);
let cookie = new Cookie;
let goldCookie = new Cookie;
let player = new Player;
let container = new Container(0, 3, utility.level[10]);

game.loop();