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
let clickEffect = [];
let xDown = null;
let yDown = null;
now.setTime(expireTime);

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
};

class Game {
  constructor() {
    this.width = dimension[0];
    this.height = dimension[1];
    this.frameW = 120;
    this.frameH = 120;
    this.textSize = this.frameW;
    // background
    ctxS.fillStyle = "hsl(195, 50%, 70%)";
    ctxS.fillRect(0, 0, this.width, this.height);
    // money area
    ctxS.fillStyle = "white";
    ctxS.strokeStyle = "black";
    ctxS.lineWidth = 10;
    ctxS.fillRect(0, 0, this.width, this.textSize);
    ctxS.strokeRect(0, 0, this.width, this.textSize);
    ctxS.fillStyle = "black";
    ctxS.textAlign = "right";
    ctxS.textBaseline = "top";
    ctxS.font = this.textSize + "px calibri";
    ctxS.fillText("Shop \u21D3", this.width - 10, 5);
  };
  draw() {
    if (utility.level[9] > 0) {
      if (container.full) {
        ctxD.fillStyle = "green";
      } else {
        ctxD.fillStyle = "white";
      }
      ctxD.fillRect(game.width - (3 * game.textSize), game.height - (2 * game.textSize) - 10, this.width, this.height);
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
    ctxD.clearRect(0, 0, game.width, game.height);
    // draw the game
    game.draw();
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
    // draw the menu
    utility.drawM();
    if (!utility.upgrading) {
      cookie.draw(cookie.x, cookie.xV, cookie.y, cookie.yV, cookie.r, cookie.pulseCount, cookie.color(), 0);
      if (utility.level[9] > 0) container.draw();
      utility.drawD();
    }
    // draw golden cookie
    if (goldCookie.gold && !utility.upgrading) {
      goldCookie.draw(goldCookie.rX, 0, goldCookie.rY, 0, goldCookie.rR, 0, 3, 0);
      goldCookie.goldCount--;
    };
    // loop
    requestAnimationFrame(game.loop);
  };
};

class InputHandler {
  constructor() {
    this.dY = 0;
    this.dX = 0;
    document.addEventListener("click", (e) => {
      // check if in the cookie
      if ((Math.pow(e.x - cookie.x, 2) + Math.pow(e.y - cookie.y, 2)) < Math.pow(cookie.r + cookie.pulseCount, 2)) {
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
      // check if inside golden cookie
      if ( goldCookie.gold && (Math.pow(e.x - goldCookie.rX, 2) + Math.pow(e.y - goldCookie.rY, 2)) < Math.pow(goldCookie.rR, 2) ) {
        goldCookie.goldReset();
      };
      // check if money was clicked
      if (!utility.upgrading) {
        if (e.x < game.width && e.y < game.textSize)
        utility.upgrading = true;
      } else {
        if (e.x < game.width && e.y > game.height - game.textSize)
        utility.upgrading = false;
      };
      //check if jar is tapped
      if (utility.level[9] > 0 && !utility.upgrading && yDown > game.height - (3 * game.textSize) && xDown > game.width - (3 * game.textSize)) {
        container.sell();
      };
      // check if in upgrade button area
      if (utility.upgrading && e.x > btn1.x && e.x < (btn1.x + btn1.size)) {
        // check each button
        // max level && can afford? && position
        if (utility.level[0] < 500 && utility.cost[0] <= utility.money && e.y > btn1.y - input.dY && e.y < btn1.y + game.frameH - input.dY) {
          utility.upgrade(utility.cost[0], 0, "extraMoney");
        };
        if (utility.level[1] == 0 && utility.cost[1] <= utility.money && e.y > btn2.y - input.dY && e.y < btn2.y + game.frameH - input.dY) {
          utility.upgrade(utility.cost[1], 1, "explodable");
        };
        if (utility.level[2] < 100 && utility.cost[2] <= utility.money && e.y > btn3.y - input.dY && e.y < btn3.y + game.frameH - input.dY) {
          utility.upgrade(utility.cost[2], 2, "explodeBonus");
        };
        if (utility.level[3] == 0 && utility.cost[3] <= utility.money && e.y > btn4.y - input.dY && e.y < btn4.y + game.frameH - input.dY) {
          utility.upgrade(utility.cost[3], 3, "rolling");
        };
        if (utility.level[4] < 500 && utility.cost[4] <= utility.money && e.y > btn5.y - input.dY && e.y < btn5.y + game.frameH - input.dY) {
          utility.upgrade(utility.cost[4], 4, "rollingDur");
        };
        if (utility.level[5] < 500 && utility.cost[5] <= utility.money && e.y > btn6.y - input.dY && e.y < btn6.y + game.frameH - input.dY) {
          utility.upgrade(utility.cost[5], 5, "rollingMax");
        };
        if (utility.level[6] < 200 && utility.cost[6] <= utility.money && e.y > btn7.y - input.dY && e.y < btn7.y + game.frameH - input.dY) {
          utility.upgrade(utility.cost[6], 6, "multiplier");
        };
        if (utility.level[7] < 99 && utility.cost[7] <= utility.money && e.y > btn8.y - input.dY && e.y < btn8.y + game.frameH - input.dY) {
          utility.upgrade(utility.cost[7], 7, "autoClick");
        };
        if (utility.level[8] == 0 && utility.cost[8] <= utility.money && e.y > btn9.y - input.dY && e.y < btn9.y + game.frameH - input.dY) {
          utility.upgrade(utility.cost[8], 8, "golden");
        };
        if (utility.level[9] < 5 && utility.cost[9] <= utility.money && e.y > btn10.y - input.dY && e.y < btn10.y + game.frameH - input.dY) {
          utility.upgrade(utility.cost[9], 9, "containerLvl");
          console.log(utility.level[9]);
        };
        if (utility.level[9] > 0 && utility.level[10] < 50 && utility.cost[10] <= utility.money && e.y > btn11.y - input.dY && e.y < btn11.y + game.frameH - input.dY) {
          utility.upgrade(utility.cost[10], 10, "containerCap");
        };
        if (utility.level[9] > 0 && utility.level[11] < 100 && utility.cost[11] <= utility.money && e.y > btn12.y - input.dY && e.y < btn12.y + game.frameH - input.dY) {
          utility.upgrade(utility.cost[11], 11, "containerWorth");
        };
        if (utility.level[9] > 0 && utility.level[12] == 0 && utility.cost[12] <= utility.money && e.y > btn13.y - input.dY && e.y < btn13.y + game.frameH - input.dY) {
          utility.upgrade(utility.cost[12], 12, "containerFill");
        };
        if (utility.level[9] > 0 && utility.level[13] == 0 && utility.cost[13] <= utility.money && e.y > btn14.y - input.dY && e.y < btn14.y + game.frameH - input.dY) {
          utility.upgrade(utility.cost[13], 13, "containerSell");
        };
      };
    });
    document.addEventListener("touchstart", (e) => {
      const firstTouch = e.touches[0];
      xDown = firstTouch.clientX;
      yDown = firstTouch.clientY;
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
    this.money = utility.money;
  };

  update() {
    // set up a save function
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
    this.money = 0;
    // get the stored upgrade values
    this.level = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.cost = [20, 500, 1000, 7500, 1000, 7500, 50000, 1000, 10000, 500, 1500, 5000, 10000, 100000];
    // testing purposes
    // this.cost = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
    this.upgrading = false;

    // 0 = increase money per click, 1 = cookie explodable
    // 2 = increase bonus money, 3 = less clicks to explode
    // 4 = rolling multiplier, 5 = increase rolling duration
    // 6 = increase rolling max, 7 = overall multiplier,
    // 8 = auto click, 9 = unlock golden cookies
    // 10 = level up container, 11 = less cookies to fill container
    // 12 = increase container worth, 13 = auto clicks pack containers
    // 14 = auto sell containers

    this.event = null;
    this.occuring = 0;
    this.upArrow = "\u21D1";
    this.downArrow = "\u21D3";
    this.checkMark = "\uD83D\uDDF9";
    this.switch = false;
    // upgrade variables
    this.explodable = false;
    this.rolling = false;
    this.rollTime = 1000;
    this.goldable = false;
    this.multiplier = 1;
    if (this.level[7] > 0) {
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
          ctxD.fillText("$" + clickEffect[i].text, clickEffect[i].x, clickEffect[i].y + clickEffect[i].time + game.textSize);
        } else {
          ctxD.fillStyle = "red";
          ctxD.textAlign = "center";
          ctxD.font = game.textSize + "px calibri";
          ctxD.fillText("-$" + clickEffect[i].text, clickEffect[i].x, clickEffect[i].y + clickEffect[i].time + game.textSize);
        }
        clickEffect[i].time -= clickEffect.length;
      } else {
        clickEffect.splice(0, 1);
      }
    };
    // draw the money
    ctxD.fillStyle = "black";
    ctxD.textAlign = "left";
    ctxD.textBaseline = "top";
    ctxD.font = game.textSize + "px calibri";
    ctxD.fillText("$" + player.money, 10, 5);
    if (this.rolling) {
      var txt = game.textSize;
      // bounding ellipse
      ctxD.fillStyle = "white";
      ctxD.strokeStyle = "black";
      ctxD.beginPath();
      ctxD.ellipse(
        game.width - 100, // x
        txt + 50, // y
        txt / 2, // radius x
        txt / 4, // radius y
        0, // rotation
        0, // start angle
        2 * Math.PI // end angle
      );
      ctxD.closePath();
      ctxD.fill();
      ctxD.stroke();
      // slow filling timer
      if (input.lastClick > this.rollTime && this.clickCount > 0) {
        ctxD.fillStyle = "rgba(255,0,0,0.6)";
        ctxD.beginPath();
        ctxD.ellipse(
          game.width - 100, // x
          txt + 50, // y
          ((this.time - input.lastClick) / this.rollTime) * (txt / 2) % (txt / 2), // radius x
          txt / 4, // radius y
          0, // rotation
          0, // start angle
          2 * Math.PI // end angle
        );
        ctxD.closePath();
        ctxD.fill();
      };
      // counter
      ctxD.fillStyle = "black";
      ctxD.strokeStyle = "grey";
      ctxD.textAlign = "right";
      ctxD.textBaseline = "bottom";
      ctxD.font = (txt * 0.5) + "px calibri";
      ctxD.strokeText("x" + this.clickCount, game.width - txt / 2, txt * 1.7);
      ctxD.fillText("x" + this.clickCount, game.width - txt / 2, txt * 1.7);
    };
  };
  drawM() {
    // draw the upgrade screen
    if (utility.upgrading) {
      // background
      ctxD.fillStyle = "white";
      ctxD.strokeStyle = "black";
      ctxD.lineWidth = 10;
      ctxD.fillRect(0, 0, game.width, game.height);
      // the buttons
      btn1.draw(1, 1, 100);
      btn1.drawText(utility.level[0], utility.convert(utility.cost[0]), 1, 1, "More money per cookie");
      btn2.draw(2, 2, 100);
      btn2.drawText(utility.level[1], utility.convert(utility.cost[1]), 2, 2, "Exploding cookie");
      btn3.draw(3, 3, 100);
      btn3.drawText(utility.level[2], utility.convert(utility.cost[2]), 3, 3, "Increase explode bonus");
      btn4.draw(4, 4, 100);
      btn4.drawText(utility.level[3], utility.convert(utility.cost[3]), 4, 4, "Rolling clicks bonus");
      btn5.draw(5, 5, 100);
      btn6.draw(6, 6, 100);
      if (utility.level[3] > 0) {
        btn5.drawText(utility.level[4], utility.convert(utility.cost[4]), 5, 5, "Increase rolling click duration");
        btn6.drawText(utility.level[5], utility.convert(utility.cost[5]), 6, 6, "Increase max rolling bonus");
      } else {
        btn5.drawText(utility.level[4], utility.convert(utility.cost[4]), 5, 5, "Requires Rolling clicks bonus");
        btn6.drawText(utility.level[5], utility.convert(utility.cost[5]), 6, 6, "Requires Rolling clicks bonus");
      };
      btn7.draw(7, 7, 100);
      btn7.drawText(utility.level[6], utility.convert(utility.cost[6]), 7, 7, "Overall multiplier");
      btn8.draw(8, 8, 100);
      btn8.drawText(utility.level[7], utility.convert(utility.cost[7]), 8, 8, "Auto clicking cookie");
      btn9.draw(9, 9, 100);
      btn9.drawText(utility.level[8], utility.convert(utility.cost[8]), 9, 9, "Unlock golden cookies");
      btn10.draw(10, 10, 100);
      btn11.draw(11, 11, 100);
      btn12.draw(12, 12, 100);
      btn13.draw(13, 13, 100);
      btn14.draw(14, 14, 100);
      if (utility.level[9] > 0) {
        btn10.drawText(utility.level[9], utility.convert(utility.cost[9]), 10, 10, "Increase container level");
        btn11.drawText(utility.level[10], utility.convert(utility.cost[10]), 11, 11, "Decrease size of container");
        btn12.drawText(utility.level[11], utility.convert(utility.cost[11]), 12, 12, "Increase the sell price of containers");
        btn13.drawText(utility.level[12], utility.convert(utility.cost[12]), 13, 13, "Auto clicks now fill up containers");
        btn14.drawText(utility.level[13], utility.convert(utility.cost[13]), 14, 14, "Auto sells your full containers");
      } else {
        btn10.drawText(utility.level[9], utility.convert(utility.cost[9]), 10, 10, "Unlock containers");
        btn11.drawText(utility.level[10], utility.convert(utility.cost[10]), 11, 11, "Requires Unlock containers");
        btn12.drawText(utility.level[11], utility.convert(utility.cost[11]), 12, 12, "Requires Unlock containers");
        btn13.drawText(utility.level[12], utility.convert(utility.cost[12]), 13, 13, "Requires Unlock containers");
        btn14.drawText(utility.level[13], utility.convert(utility.cost[13]), 14, 14, "Requires Unlock containers");
      };








      // money
      ctxD.fillStyle = "lightgrey";
      ctxD.fillRect(0, 0, game.width, game.textSize);
      ctxD.fillStyle = "black";
      ctxD.textAlign = "center";
      ctxD.textBaseline = "top";
      ctxD.font = game.textSize + "px calibri";
      ctxD.fillText("$" + player.money, game.width / 2, 10);
      ctxD.textAlign = "right";
      ctxD.fillStyle = "lightgrey";
      ctxD.fillRect(0, game.height - game.textSize, game.width, game.textSize);
      ctxD.fillStyle = "black";
      ctxD.fillText("Shop " + this.upArrow, game.width - 10, game.height - game.textSize);
      ctxD.strokeRect(0, game.height - game.textSize, game.width, game.height);
    };
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
      console.log("click me please!");
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
      if (utility.tapRate < 999) utility.tapRate += 50;
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
      case "rolling":
      clickEffect.push(new Effects(utility.convert(utility.cost[3]), game.width / 2, clickEffect.length, false));
      utility.cost[3] = utility.checkMark;
      utility.event = null;
      break;
      case "rollingDur":
      // more duration before expiry
      clickEffect.push(new Effects(utility.convert(utility.cost[4]), game.width / 2, clickEffect.length, false));
      utility.cost[4] = Math.floor(utility.cost[4] * 4);
      utility.event = null;
      break;
      case "rollingMax":
      // higher rolling count before stopping
      clickEffect.push(new Effects(utility.convert(utility.cost[5]), game.width / 2, clickEffect.length, false));
      utility.maxClickCount += 5;
      utility.cost[5] = Math.floor(utility.cost[5] * 2.85);
      utility.event = null;
      break;
      case "multiplier":
      clickEffect.push(new Effects(utility.convert(utility.cost[6]), game.width / 2, clickEffect.length, false));
      utility.cost[6] = Math.floor(utility.cost[6] * 10);
      utility.event = null;
      break;
      case "autoClick":
      clickEffect.push(new Effects(utility.convert(utility.cost[7]), game.width / 2, clickEffect.length, false));
      utility.cost[7] = Math.floor(utility.cost[7] * 1.65);
      utility.event = null;
      break;
      case "golden":
      clickEffect.push(new Effects(utility.convert(utility.cost[8]), game.width / 2, clickEffect.length, false));
      utility.cost[8] = utility.checkMark;
      utility.event = null;
      break;
      case "goldCookie":
      clickEffect.push(new Effects(utility.convert(cookie.goldWorth), game.width / 2, clickEffect.length, true));
      utility.event = null;
      break;
      case "sell":
      clickEffect.push(new Effects(utility.convert(container.worth), game.width / 2, clickEffect.length, true));
      utility.event = null;
      break;
      case "containerLvl":
      clickEffect.push(new Effects(utility.convert(utility.cost[9]), game.width / 2, clickEffect.length, false));
      utility.cost[9] = Math.floor(utility.cost[9] * 10);
      utility.event = null;
      break;
      case "containerCap":
      clickEffect.push(new Effects(utility.convert(utility.cost[10]), game.width / 2, clickEffect.length, false));
      utility.cost[10] = Math.floor(utility.cost[10] * 6);
      utility.event = null;
      break;
      case "containerWorth":
      clickEffect.push(new Effects(utility.convert(utility.cost[11]), game.width / 2, clickEffect.length, false));
      utility.cost[11] = Math.floor(utility.cost[11] * 2.27);
      utility.event = null;
      break;
      case "containerFill":
      clickEffect.push(new Effects(utility.convert(utility.cost[12]), game.width / 2, clickEffect.length, false));
      utility.cost[12] = utility.checkMark;
      utility.event = null;
      break;
      case "containerSell":
      clickEffect.push(new Effects(utility.convert(utility.cost[13]), game.width / 2, clickEffect.length, false));
      utility.cost[13] = utility.checkMark;
      utility.event = null;
      break;
    }
  };
  update() {
    // tap if auto click is on
    if (this.autoTap) this.autoClick();
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
      return game.height / 4;
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
    this.y = y;
    this.type = type;
    this.time = game.height / 2;
  };

};

class Button {
  constructor(width, height, column, row) {
    this.width = width;
    this.height = height;
    this.column = column;
    this.row = row;
    this.x = game.frameW;
    this.y = (1.2 * game.textSize * column) + (1.5 * game.textSize);
    this.xText = 10;
    this.yText = (1.2 * game.textSize * column) + (1.5 * game.textSize);
    this.xPrice = game.frameW + game.frameW;
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
    ctxD.fillText(level, this.xText, this.yText + (game.frameH / 6) - input.dY);
    // the button price
    ctxD.fillStyle = "black";
    ctxD.textAlign = "left";
    ctxD.textBaseline = "top";
    ctxD.font = (game.textSize * 0.4) + "px calibri";
    ctxD.fillText("$" + price, this.xPrice, this.yText - input.dY);
    // the button description
    ctxD.font = (game.textSize * 0.4) + "px calibri";
    ctxD.fillText(description, this.xPrice, this.yText + (game.frameH / 2) - input.dY);
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
    if (btn14.y - input.dY < (game.height - (2.3 * game.textSize))) {
      input.dY -= 2;
      if (btn14.y - input.dY < (game.height - (2.5 * game.textSize))) {
        input.dY -= 10;
      };
      if (btn14.y - input.dY < (game.height - (6 * game.textSize))) {
        input.dY -= 50;
      };
    };
  }; // end update
};

let game = new Game;
let input = new InputHandler;
let utility = new Utility;
let btn1 = new Button(game.frameW, game.frameH, 0, 2);
let btn2 = new Button(game.frameW, game.frameH, 1, 2);
let btn3 = new Button(game.frameW, game.frameH, 2, 2);
let btn4 = new Button(game.frameW, game.frameH, 3, 2);
let btn5 = new Button(game.frameW, game.frameH, 4, 2);
let btn6 = new Button(game.frameW, game.frameH, 5, 2);
let btn7 = new Button(game.frameW, game.frameH, 6, 2);
let btn8 = new Button(game.frameW, game.frameH, 7, 2);
let btn9 = new Button(game.frameW, game.frameH, 8, 2);
let btn10 = new Button(game.frameW, game.frameH, 9, 2);
let btn11 = new Button(game.frameW, game.frameH, 10, 2);
let btn12 = new Button(game.frameW, game.frameH, 11, 2);
let btn13 = new Button(game.frameW, game.frameH, 12, 2);
let btn14 = new Button(game.frameW, game.frameH, 13, 2);
let cookie = new Cookie;
let goldCookie = new Cookie;
let player = new Player;
let container = new Container(0, 3, 0);

game.loop();
