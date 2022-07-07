const canv = document.getElementById("gameCanvas");
const ctx = canv.getContext("2d");
const texture = document.getElementById("textureSheet");
const dimension = [document.documentElement.clientWidth, document.documentElement.clientHeight];
canv.width = dimension[0];
canv.height = dimension[1];

let lastTime = 0;
var now = new Date();
var time = now.getTime();
var expireTime = time + (365 * 24 * 60 * 60);
let clickEffect = [];
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
    this.textSize = (this.height / this.width) * 50;
    this.frameW = 120;
    this.frameH = 120;
  };
  draw() {
    // background
    ctx.beginPath();
    ctx.fillStyle = "hsl(195, 50%, 70%)";
    ctx.fillRect(0, 0, this.width, this.height);
    ctx.fill();
  };
  loop(now) {
    // clear canvas
    ctx.clearRect(0, 0, dimension[0], dimension[1]);
    // draw backgroud
    game.draw();
    // update and draw cookie
    cookie.update();
    cookie.draw(cookie.x, cookie.xV, cookie.y, cookie.yV, cookie.r, cookie.pulseCount, cookie.color(), cookie.color());
    // auto click occasionally
    if (!lastTime || now - lastTime >= (1000 - utility.tapRate)) {
      lastTime = now;
      utility.update();
    };
    if (utility.occuring > 0) {
      utility.events();
      utility.occuring--;
      utility.occuring--;
    };
    utility.draw();
    if (utility.upgrading) {
      // draw the buttons
      autoClickBtn.draw(autoClickBtn.x, autoClickBtn.y, 100);
      autoClickBtn.drawText(utility.level[0], utility.autoTapCost, autoClickBtn.x, autoClickBtn.y);
      extraMoneyBtn.draw(extraMoneyBtn.x, extraMoneyBtn.y, 100);
      extraMoneyBtn.drawText(utility.level[1], utility.extraMoneyCost, extraMoneyBtn.x, extraMoneyBtn.y);
    };
    //  check if golden cookie should spawn
    if (!utility.upgrading && !goldCookie.gold && Math.random() > 0.9) {
      goldCookie = new Cookie();
      goldCookie.goldCount = 100;
      goldCookie.gold = true;
    };
    // draw golden cookie
    if (goldCookie.gold && !utility.upgrading) {
      goldCookie.draw(goldCookie.rX, 0, goldCookie.rY, 0, goldCookie.rR, 0, 3, 3);
      goldCookie.goldCount--;
    };
    if (goldCookie.goldCount < 0) {
      goldCookie.gold = false;
    };
    // update player information
    player.update();
    // loop
    requestAnimationFrame(game.loop);
  };
};

class InputHandler {
  constructor() {
    document.addEventListener("click", (e) => {
      // check if in the cookie
      if ( (Math.pow(e.x - cookie.x, 2) + Math.pow(e.y - cookie.y, 2)) <
      Math.pow(cookie.r + cookie.pulseCount, 2) ) {
        // if cookie should expand
        if (cookie.r + cookie.pulseCount < cookie.r * 3) {
          cookie.expand();
        } else {
          cookie.reset();
        }
      };
      // check if inside golden cookie
      if ( goldCookie.gold && (Math.pow(e.x - goldCookie.rX, 2) + Math.pow(e.y - goldCookie.rY, 2)) < Math.pow(goldCookie.rR, 2) ) {
        goldCookie.goldReset();
      }
      // check if money was clicked
      if (e.x > 0 && e.x < game.width &&
    e.y > 0 && e.y < game.textSize) {
      if (!utility.upgrading) utility.upgrading = true;
      else utility.upgrading = false;
    };
      // check if inside  auto click button
      if (utility.upgrading && e.x > autoClickBtn.x &&
        e.x < (autoClickBtn.x + (autoClickBtn.size)) &&
        e.y > autoClickBtn.y &&
        e.y < (autoClickBtn.y + (autoClickBtn.size))) {
          if (utility.autoTapCost < utility.money) {
            utility.upgrade(utility.autoTapCost, 0, "autoTap");
          }
        }
        // check if inside extra money button
        if (utility.upgrading && e.x > extraMoneyBtn.x &&
          e.x < (extraMoneyBtn.x + (extraMoneyBtn.size)) &&
          e.y > extraMoneyBtn.y &&
          e.y < (extraMoneyBtn.y + (extraMoneyBtn.size))) {
            if (utility.extraMoneyCost < utility.money) {
              utility.upgrade(utility.extraMoneyCost, 1, "extraMoney");
            }
          }
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
        document.cookie = "playerMoney=" + utility.money + "; expires=" + now.toUTCString() + "; path=/";
        document.cookie = "playerUpgrades=" + utility.level + "; expires=" + now.toUTCString() + "; path=/";
        this.money = utility.money;
      };
    };

    class Utility {
      constructor() {
        // get the stored money value
        this.money = 0;
        // get the stored upgrade values
        this.level = [0, 0, 0, 0];
        this.upgrading = false;

        // 0 = auto click, 1 = increase money per click,
        // 2 = increase bonus money, 3 = less clicks to explode
        // 4 = increase multiplier, 5 = unlock golden cookies

        this.event = null;
        this.occuring = 0;
        this.multiplier = 1;
        this.bonusMoney = 50 * this.multiplier;
        this.goldMoney = 500 * this.multiplier;
        this.upArrow = "\u21D1"
        this.downArrow = "\u21D3"
        this.switch = false;
        // upgrade variables
        if (this.level[0] > 0) {
          this.autoTap = true;
        } else {
          this.autoTap = false;
        }
        this.autoTapCost = 100;
        this.tapRate = 0;

        this.extraMoneyCost = 100;
      };
      draw() {
        // draw the earned money
        for (let i = 0; i < clickEffect.length; i++) {
          if (clickEffect[i].time > 0) {
            if (clickEffect[i].type) {
              ctx.fillStyle = "green";
              ctx.textAlign = "center";
              ctx.font = (game.textSize / 3) + "px calibri";
              ctx.fillText("$" + clickEffect[i].text, clickEffect[i].x, clickEffect[i].y + clickEffect[i].time);
            } else {
              ctx.fillStyle = "red";
              ctx.textAlign = "center";
              ctx.font = (game.textSize / 2) + "px calibri";
              ctx.fillText("-$" + clickEffect[i].text, clickEffect[i].x, clickEffect[i].y + clickEffect[i].time);
            }
            clickEffect[i].time--;
          } else {
            clickEffect.splice(0, 1);
          }
        };
        // draw the money  + upgrades area
        ctx.fillStyle = "white";
        if (!this.upgrading) ctx.fillRect(0, 0, game.width, game.textSize);
        else ctx.fillRect(0, 0, game.width, game.height);

        ctx.fillStyle = "black";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.font = game.textSize + "px calibri";
        ctx.fillText("$" + player.money, 10, 5);
        if (!this.upgrading) {
          ctx.fillText(this.downArrow, game.width - game.textSize, 5);
        } else {
          ctx.fillText(this.upArrow, game.width - game.textSize, 5);
        };

      };
      explode() {
        cookie.exploding = true;
        cookie.explode = cookie.explodeFor;
        for (var i = 0; i < (this.bonusMoney / 5); i++) {
          cookie.expCookie[i] = new Cookie;
        }
      };
      autoClick() {
        this.money += 1 * this.level[0];
        utility.event = "autoClick";
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
        switch (specific) {
          case "autoTap":
          utility.event = "upgrade1";
          utility.autoTap = true;
          if (utility.tapRate < 900) utility.tapRate += 20;
          console.log(utility.tapRate);
          break;
          case "extraMoney":
          utility.event = "upgrade2";

        }
      };
      alternate() {
        var choice = [];
        if (this.switch) {
          choice.push(game.frameW / 6);
        } else {
          choice.push(game.frameW / 2.5);
        }
        this.switch = !this.switch;
        return choice;
      };
      events() {
        switch (utility.event) {
          case "click":
          clickEffect.push(new Effects(1 + utility.level[1], this.alternate(), 0, true));
          utility.event = null;
          break;
          case "autoClick":
          clickEffect.push(new Effects(utility.level[0], this.alternate(), 0 , true));
          utility.event = null;
          break;
          case "reset":
          clickEffect.push(new Effects(utility.bonusMoney, game.frameW / 2, clickEffect.length, true));
          utility.event = null;
          break;
          case "upgrade1":
          clickEffect.push(new Effects(utility.autoTapCost, game.frameW , clickEffect.length, false));
          utility.autoTapCost = Math.floor(utility.autoTapCost * 1.1);
          utility.event = null;
          break;
          case "upgrade2":
          clickEffect.push(new Effects(utility.extraMoneyCost, game.frameW, clickEffect.length, false));
          utility.extraMoneyCost = Math.floor(utility.extraMoneyCost * 1.1);
          utility.event = null;
          break;
          case "goldCookie":
          clickEffect.push(new Effects(utility.goldMoney, game.frameW / 2, clickEffect.length, true));
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
        utility.money += 1 + utility.level[1];
        utility.event = "click";
        utility.occuring = 100;
      };
      reset() {
        utility.event = "reset";
        utility.occuring = 100;
        cookie.pulseCount = cookie.pulse;
        utility.money += utility.bonusMoney;
        utility.explode();
      };
      boom(which, color) {
        // draw new cookies
        this.expCookie.forEach(function(c) {
          which.draw(c.x + (c.r / 3), c.xV, c.y + (c.r / 3), c.yV, c.r / 2, c.pulseCount, color, color);
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
        utility.money += utility.goldMoney;
        utility.event = "goldCookie";
        utility.occuring = 100;
        goldCookie.gold = false;
        goldCookie.clicked = true;
        goldCookie.exploding = true;
        goldCookie.explode = goldCookie.explodeFor;
        for (var i = 0; i < (utility.bonusMoney / 5); i++) {
          goldCookie.expCookie[i] = new Cookie;
        };
      };
      draw(x, xV, y, yV, r, pC, column, row) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(
          texture, // the texture sheet
          column * game.frameW, // starting x
          row * game.frameH, // starting y
          game.frameW, // width
          game.frameH, // height
          x + xV - r - pC / 2, // destination x
          y + yV - r - pC / 2, // destination y
          (2 * r) + pC, // drawn width
          (2 * r) + pC); // drawn height
        };
        update() {
          // deflate the cookie
          if (cookie.pulseCount > 0) cookie.pulseCount--;
          // explode cookie
          if (cookie.exploding || goldCookie.clicked) {
            cookie.boom(cookie, 2);
            utility.events(utility.bonusMoney, 0, 0, true);
          };
          if (goldCookie.exploding) {
            goldCookie.boom(goldCookie, 3);
            utility.events(utility.goldMoney, 0, 0, true);
          };
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
          this.x = (game.frameW * column) - game.frameW + 10;
          this.y = game.height - game.frameH;
        };
        draw(x, y, size) {
          // the button box
          this.x = x;
          this.y = y;
          this.size = size;
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
          ctx.drawImage(
            texture, // the texture sheet
            this.column * game.frameW, // starting x
            this.row * game.frameH, // starting y
            game.frameW, // width
            game.frameH, // height
            this.x, // destination x
            this.y, // destination y
            this.size, // drawn width
            this.size); // drawn height
          };
          drawText(level, price, x, y) {
            // the button level
            ctx.fillStyle = "black";
            ctx.textAlign = "left";
            ctx.textBaseline = "top";
            ctx.font = (game.textSize * 0.75) + "px calibri";
            ctx.fillText(level, x + 10, y);
            // the button price
            ctx.fillStyle = "black";
            ctx.textAlign = "left";
            ctx.textBaseline = "top";
            ctx.font = (game.textSize * 0.5) + "px calibri";
            ctx.fillText("$" + price,  x, y + (game.frameH / 2));
          };
        };

        let game = new Game;
        let input = new InputHandler;
        let utility = new Utility;
        let autoClickBtn = new Button(game.width, game.height, 1, 0);
        let extraMoneyBtn = new Button(game.width, game.height, 2, 0);
        let cookie = new Cookie;
        let goldCookie = new Cookie;
        let player = new Player;

        game.loop();
