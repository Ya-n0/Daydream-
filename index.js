//Game//
let gameState = 0;
let startBtn, rulesBtn, homeBtn;
let blackman;
let yellowman;
let blackwomen;
let yellowwomen;
let blackmc;
let yellowmc;
let SadMC;
let nightlampbackimg;
let yellowmcrun;

let gameStartTime;
let gameTimer = 20;
let lightLevel = 50;

let playerSprite;
let leftSprite;
let rightSprite;
let currentPlayerImage;
let currentSpriteType = null;
let completedSprites = [];
let totalSpritesNeeded = 3;

function preload(){
    blackman = loadImage("assets/blackman.png");
    yellowman = loadImage("assets/yellowman.png");
    blackwomen = loadImage("assets/blackwomen.png");
    yellowwomen = loadImage("assets/yellowwomen.png");
    blackmc = loadImage("assets/blackmc.png");
    yellowmc = loadImage("assets/yellowmc.png");
    nightlampbackimg = loadImage("assets/nightlamp.jpeg");
    yellowmcrun = loadAni("assets/yellowmcrun.png", { frameSize: [114, 282], frames: 3, frameDelay: 8 });
}

function setup() {
  createCanvas(500,500);
  currentPlayerImage = blackmc;
  initializeHome();
  }

  function draw() {
    if (gameState == 0) {
      drawHome();
      if (rulesBtn.mouse.presses()) {
        gameState = 1;
        showInstructions();
      } else if (startBtn.mouse.presses()) {
        gameState = 2;
        initializeGameplay();
      }
    }

    if (gameState == 1) {
      if (homeBtn.mouse.presses()) {
        gameState = 0;
        initializeHome();
        homeBtn.pos = { x: -350, y: -350 };
      }
    }

    if (gameState == 2) {
      if (!gameStartTime) {
        background(50);
        fill(255);
        textAlign(CENTER);
        textSize(24);
        text("Click the character to begin", width/2, 100);

        if (SadMC.mouse.presses()) {
          gameStartTime = millis();
          SadMC.scale = 2.0;
          SadMC.x = width/2;
          SadMC.y = height - 50;
          if (!currentSpriteType) {
            currentSpriteType = 'main';
          }
        }
        return;
      }

      let currentTime = millis();
      let timeElapsed = (currentTime - gameStartTime) / 1000;
      gameTimer = 20 - timeElapsed;

      if (gameTimer <= 0 || lightLevel <= 10 || lightLevel >= 90) {
        gameState = 3;
        return;
      }

      let darknessLevel;
      if (timeElapsed < 14) {
        darknessLevel = map(timeElapsed, 0, 14, 3, 24);
      } else {
        darknessLevel = map(timeElapsed, 14, 20, 24, 26);
      }

      let mouseDistance = dist(mouseX, mouseY, width/2, height/2);
      let mouseLightEffect = map(mouseDistance, 0, width/2, 6, 0);

      let lightingMultiplier;
      let darknessMultiplier;

      if (lightLevel < 50) {
        lightingMultiplier = 0.05;
        darknessMultiplier = 1.8;
      } else {
        lightingMultiplier = 0.15;
        darknessMultiplier = 0.7;
      }

      if (mouseIsPressed || pmouseX != mouseX || pmouseY != mouseY) {
        lightLevel += mouseLightEffect * lightingMultiplier;
      }
      lightLevel -= darknessLevel * 0.025 * darknessMultiplier;
      lightLevel -= 0.03 * darknessMultiplier;
      lightLevel = constrain(lightLevel, 0, 100);

      let bgColor = map(lightLevel, 0, 100, 0, 200);
      background(bgColor);

      push();
      let lightRadius = map(lightLevel, 0, 100, 50, 150);
      let gradient = drawingContext.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, lightRadius);
      gradient.addColorStop(0, `rgba(255, 255, 200, 0.8)`);
      gradient.addColorStop(1, `rgba(255, 255, 200, 0)`);
      drawingContext.fillStyle = gradient;
      drawingContext.fillRect(0, 0, width, height);
      pop();

      fill(100);
      rect(50, 20, 200, 20);

      if (lightLevel < 15 || lightLevel > 85) {
        fill(255, 0, 0);
      } else if (lightLevel < 25 || lightLevel > 75) {
        fill(255, 165, 0);
      } else {
        fill(0, 255, 0);
      }
      rect(50, 20, map(lightLevel, 0, 100, 0, 200), 20);

      fill(255);
      textSize(16);
      text(`Time: ${gameTimer.toFixed(1)}s`, width - 100, 40);
      text(`Light: ${lightLevel.toFixed(0)}%`, 50, 60);


      fill(255, 235, 150, 38);
      textAlign(CENTER);
      textSize(32);
      let narrativeText = "";

      if (currentSpriteType === 'main') {
        narrativeText = "I feel so overwhelmed...Seeing \neveryone's sadness,\nincluding my own,\nmakes me feel useless.\nHow can I help others\nwhen I can barely\nhelp myself?\nThe weight of their pain\nadds to mine.\nI'm drowning in empathy\nyet feel powerless to act.";
      } else if (currentSpriteType === 'right') {
        narrativeText = "Every day I prove myself\ntwice as hard just to be\ntaken seriously.\nThis (male-dominated) field\nmakes me question\nif I belong here at all.\nMy ideas get overlooked,\nmy voice gets silenced.\nI have to fight for every\nounce of recognition\nI don't know if I can continue doing what i love.";
      } else if (currentSpriteType === 'left') {
        narrativeText = "The pressure is\ncrushing me...\nEvery assignment,\nevery test feels impossible.\nI'm drowning in expectations\nand I don't know how\nto stay afloat.\nThe fear of failure\nconsumes my thoughts.\nI'm losing myself in\nthe pursuit of perfection.";
      }

      if (narrativeText) {
        text(narrativeText, width/2, 100);
      }
    }

    if (gameState == 3) {
      if (SadMC) {
        SadMC.remove();
        SadMC = null;
      }

      background(255);

      if (gameTimer <= 0) {
        fill(0)
        text("Time's up!", width/2, height/2);
        text("Click to continue", width/2, height/2 + 50);

        if (mouseIsPressed) {
          if (currentSpriteType && !completedSprites.includes(currentSpriteType)) {
            completedSprites.push(currentSpriteType);
            console.log("Completed sprites:", completedSprites);
          }

          if (completedSprites.length >= 3) {
            console.log("All sprites completed, going to end page");
            gameState = 5;
            if (SadMC) {
              SadMC.remove();
              SadMC = null;
            }
            return;
          } else {
            gameState = 4;
            currentSpriteType = null;
            initializeSpriteSelection();
          }
        }
      } else if (lightLevel <= 10) {
        textAlign(CENTER);
        background(0)
        fill(255);
        textSize(32);
        text("Game Over!", width/2, height/2 - 50);
        textSize(20);
        text("Too dark! You lost in the darkness!", width/2, height/2);
        text("Click to restart", width/2, height/2 + 50);

        if (mouseIsPressed) {
          gameState = 0;
          initializeHome();
        }
      } else if (lightLevel >= 90) {
        background(0)
        fill(255);
        textAlign(CENTER);
        textSize(32);
        text("Game Over!", width/2, height/2 - 50);
        textSize(20);
        text("Too bright! Ignorance consumed you!", width/2, height/2);
        text("Click to restart", width/2, height/2 + 50);

        if (mouseIsPressed) {
          gameState = 0;
          initializeHome();
        }
      }
    }

    if (gameState == 4) {
      drawSpriteSelection();
    }

    if (gameState == 5) {
      drawEndGame();
    }
  }

function initializeHome() {
  startBtn = new Sprite(380, 350, 160, 100, 'k');
  startBtn.color = "gold";
  startBtn.textColor = "black";
  startBtn.textSize = 22;
  startBtn.text = "Begin Journey";

  rulesBtn = new Sprite(160, 350, 160, 100, 'k');
  rulesBtn.color = "gold";
  rulesBtn.textColor = "black";
  rulesBtn.textSize = 22;
  rulesBtn.text = "How to Play";
}

function drawHome() {
  background(nightlampbackimg);

  for(let y = 0; y < height; y += 15) {
    let alpha = map(y, 0, height, 80, 15);
    fill(30, 15, 60, alpha);
    rect(0, y, width, 15);
  }

  fill(255, 255, 255, 180);
  for(let i = 0; i < 60; i++) {
    let x = (i * 67) % width;
    let y = (i * 43) % height;
    circle(x, y, 2);
  }

  fill(0, 0, 0, 120);
  rect(0, 0, width, height);

  fill(255, 215, 0);
  textSize(80);
  textAlign(CENTER);
  text("Night Lamp", width/2, 120);
  textSize(28);
  text("Light the Darkness!", width/2, 160);
}

function showInstructions() {
  background(5, 5, 25);
  startBtn.pos = { x: -250, y: -150 };
  rulesBtn.pos = { x: -600, y: -150 };

  fill(255, 215, 0);
  textSize(32);
  textAlign(CENTER);
  text("CONTROLS", width/2, 60);

  fill(200, 200, 255);
  textSize(20);
  textAlign(LEFT);
  text("🎮 Use WASD keys or Arrow Keys to move", 50, 120);
  text("👂 Click on sad characters to hear their stories", 50, 160);
  text("🪔 Use mouse as your night lamp", 50, 200);
  text("🌟 Shine the night lamp to give characters hope", 50, 240);
  text("💀 Be careful though, too much light can lead", 50, 280);
  text("    to ignorance", 50, 310);

  homeBtn = new Sprite(250, 400, 160, 80, "k");
  homeBtn.color = "gold";
  homeBtn.textColor = "black";
  homeBtn.textSize = 20;
  homeBtn.text = "Return Home";
}

function initializeGameplay() {
  startBtn.pos = { x: -250, y: -150 };
  rulesBtn.pos = { x: -600, y: -150 };

  if (SadMC) {
    SadMC.remove();
  }

  gameState = 2;
  lightLevel = 50;
  gameStartTime = null;
  currentSpriteType = 'main';
  currentPlayerImage = blackmc;

  SadMC = new Sprite(width/2, 290, 80, 80);
  SadMC.img = blackmc;
  SadMC.scale = 1.5;
}

function initializeSpriteSelection() {
  if (SadMC) {
    SadMC.remove();
    SadMC = null;
  }
  if (playerSprite) {
    playerSprite.remove();
    playerSprite = null;
  }
  if (leftSprite) {
    leftSprite.remove();
    leftSprite = null;
  }
  if (rightSprite) {
    rightSprite.remove();
    rightSprite = null;
  }

  playerSprite = new Sprite(width/2, height/2, 60, 60);

  if (yellowmc) {
    playerSprite.addAni('idle', yellowmc);
  }
  if (yellowmcrun) {
    playerSprite.addAni('run', yellowmcrun);
  }

  if (playerSprite.animations['idle']) {
    playerSprite.changeAni('idle');
  } else {
    playerSprite.img = blackmc;
  }

  playerSprite.scale = 1;

  if (!completedSprites.includes('left')) {
    leftSprite = new Sprite(50, height/2, 60, 60);
    leftSprite.img = blackman;
    leftSprite.scale = 1;
  } else {
    leftSprite = new Sprite(50, height/2, 60, 60);
    leftSprite.img = yellowman;
    leftSprite.scale = 1;
  }

  if (!completedSprites.includes('right')) {
    rightSprite = new Sprite(width - 50, height/2, 60, 60);
    rightSprite.img = blackwomen;
    rightSprite.scale = 1;
  } else {
    rightSprite = new Sprite(width - 50, height/2, 60, 60);
    rightSprite.img = yellowwomen;
    rightSprite.scale = 1;
  }
}

function drawSpriteSelection() {
  background(255);

  if (!playerSprite) return;

  if (kb.pressing('left') || kb.pressing('a')) {
    if (playerSprite.animations['run'] && playerSprite.animation.name !== 'run') {
      playerSprite.changeAni('run');
    }
    playerSprite.vel.x = -3;
    playerSprite.mirror.x = true;
  } else if (kb.pressing('right') || kb.pressing('d')) {
    if (playerSprite.animations['run'] && playerSprite.animation.name !== 'run') {
      playerSprite.changeAni('run');
    }
    playerSprite.vel.x = 3;
    playerSprite.mirror.x = false;
  } else {
    if (playerSprite.animations['idle'] && playerSprite.animation.name !== 'idle') {
      playerSprite.changeAni('idle');
    }
    playerSprite.vel.x = 0;
  }

  if (playerSprite.x < 30) {
    playerSprite.x = 30;
  }
  if (playerSprite.x > width - 30) {
    playerSprite.x = width - 30;
  }

  if (leftSprite && playerSprite && playerSprite.colliding(leftSprite) && !completedSprites.includes('left')) {
    currentPlayerImage = blackman;
    currentSpriteType = 'left';
    startNewRound();
  }

  if (rightSprite && playerSprite && playerSprite.colliding(rightSprite) && !completedSprites.includes('right')) {
    currentPlayerImage = blackwomen;
    currentSpriteType = 'right';
    startNewRound();
  }

  if (completedSprites.length == 1 && !completedSprites.includes('main')) {
    if (mouseIsPressed && playerSprite && dist(mouseX, mouseY, playerSprite.x, playerSprite.y) < 50) {
      currentPlayerImage = blackmc;
      currentSpriteType = 'main';
      startNewRound();
    }
  }

  fill(0);
  textAlign(CENTER);
  textSize(20);

  if (completedSprites.length == 0) {
    text("Use arrow keys or A/D to move", width/2, 50);
    text("Interact with individuals to hear their story", width/2, 80);
  } else if (completedSprites.length == 1 && !completedSprites.includes('main')) {
    text("Now click the main character to finish!", width/2, 50);
  } else if (completedSprites.length >= 1 && completedSprites.includes('main')) {
    text("Look how they are glowing! \n Interact with another individual to hear their story", width/2, 50);
  }
}

function startNewRound() {
  if (playerSprite) {
    playerSprite.remove();
    playerSprite = null;
  }
  if (leftSprite) {
    leftSprite.remove();
    leftSprite = null;
  }
  if (rightSprite) {
    rightSprite.remove();
    rightSprite = null;
  }

  gameState = 2;
  lightLevel = 50;
  gameStartTime = null;

  SadMC = new Sprite(width/2, 290, 80, 80);
  SadMC.img = currentPlayerImage;
  SadMC.scale = 1.5;
}

function drawEndGame() {
  if (SadMC) {
    SadMC.remove();
    SadMC = null;
  }
  if (playerSprite) {
    playerSprite.remove();
    playerSprite = null;
  }
  if (leftSprite) {
    leftSprite.remove();
    leftSprite = null;
  }
  if (rightSprite) {
    rightSprite.remove();
    rightSprite = null;
  }

  background(nightlampbackimg);

  fill(0, 0, 0, 150);
  rect(0, 0, width, height);

  fill(255, 255, 255, 180);
  for(let i = 0; i < 60; i++) {
    let x = (i * 67) % width;
    let y = (i * 43) % height;
    circle(x, y, 2);
  }

  fill(255, 215, 0);
  textAlign(CENTER);
  textSize(60);
  text("END OF GAME", width/2, height/2 - 80);

  textSize(32);
  fill(200, 200, 255);
  text("Congratulations!", width/2, height/2 - 20);

  textSize(24);
  text("You have helped all characters", width/2, height/2 + 20);
  text("find their light in the darkness.", width/2, height/2 + 50);

  textSize(20);
  fill(255, 255, 255);
  text("Click to restart your journey", width/2, height/2 + 100);

  if (mouseIsPressed) {
    completedSprites = [];
    currentSpriteType = null;
    gameState = 0;
    lightLevel = 50;
    gameStartTime = null;
    currentPlayerImage = blackmc;
    initializeHome();
  }
}