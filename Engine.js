/*^*^*^*^*^*^*^*
Engine.js
A phaser-based game engine with tools.
*^*^*^*^*^*^*^*/

class Engine {
  constructor(phaser) {
    this.phaser = phaser;
    this.mouseDown = false;
    this.gameWidth = phaser.sys.game.canvas.width;
    this.gameHeight = phaser.sys.game.canvas.height;
    this.gameWidthCenter = this.gameWidth / 2;
    this.gameHeightCenter = this.gameHeight / 2;
  }

  // ---------- Tools ----------
  randomBetween(min, max) {
    // Returns a random number between min and max
    return Math.random() * (max - min) + min;
  }
  roundRandomBetween(min, max) {
    // Same thing as randomBetween but rounded
    // WARNING: INCLUDES BOTH MIN AND MAX
    return Math.round(Math.random() * (max - min) + min);
  }
  randomPercentage() {
    // Returns a random number between 1 and 100
    return Math.round(Math.random() * 100);
  }
  percentageCheck(percentages, percentage) {
    // Checks which range the random percentage is in, and return the index of the range
    for (var i = 0; i < percentages.length; i++) {
      if (percentage >= percentages[i][0] && percentage < percentages[i][1]) {
        return percentages.indexOf(percentages[i]);
      }
    }
  }
  randomBool() {
    // Returns a random boolean, true or false
    return Boolean(Math.floor(Math.random() * 2));
  }

  // ---------- Phaser ----------
  mouseInput() {
    // Checks whether the mouse is down
    let engine = this;
    this.phaser.input.on("pointerdown", function () {
      engine.mouseDown = true;
    });
    this.phaser.input.on("pointerup", function () {
      engine.mouseDown = false;
    });
  }
  pixelCursor() {
    // Adds a custom pixel cursor
    // WARNING: Hide the default cursor in the index.html before using this function
    this.mouseInput();
    this.cursor = this.phaser.physics.add.sprite(this.phaser.input.mousePointer.x, this.phaser.input.mousePointer.y, "cursor").setScale(8).setGravityY(-1500).setSize(2, 2).setOffset(0, 0).setOrigin(0, 0);
    this.cursor.setDepth(Infinity);
    this.phaser.input.on("pointerdown", () => {
      this.cursor.setScale(6.5);
    });
    this.phaser.input.on("pointerup", () => {
      this.cursor.setScale(8);
    });
  }
  updatePixelCursor() {
    // Sets the position of pixel cursor
    this.cursor.x = this.phaser.input.mousePointer.x;
    this.cursor.y = this.phaser.input.mousePointer.y;
  }
  addAnimation(name, frameRate, repeat, yoyo, ...keys) {
    // Adds a animation
    let keyArray = [];
    for (var i = 0; i < keys.length; i++) {
      keyArray.push({key: keys[i]});
    }
    this.phaser.anims.create({
      key: name,
      frames: keyArray,
      frameRate: frameRate,
      repeat: repeat ? -1 : 0,
      yoyo: yoyo
    });
  }
  setBackgroundColor(phaser, hex) {
    // Sets the background color of the camera
    phaser.cameras.main.backgroundColor = Phaser.Display.Color.HexStringToColor("#ffffff");
  }
  setPhaserInterval(callback, time) {
    // Does the same thing as setInterval, but using Phaser
    this.phaser.time.addEvent({
      delay: time,
      callback: callback,
      repeat: -1
    });
  }
  isKeyDown(key) {
    return this.phaser.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[key]).isDown;
  }
}

// ---------- Common scenes ----------
class Cutscene extends Phaser.Scene {
  constructor(key, sprite1, sprite2, vs, nextScene) {
    super(key);
    this.sprite1path = sprite1;
    this.sprite2path = sprite2;
    this.vspath = vs;
    this.nextScene = nextScene;
    this.complete = false;
  }
  preload() {
    this.load.image(this.sprite1path, this.sprite1path);
    this.load.image(this.sprite2path, this.sprite2path);
    this.load.image(this.vspath, this.vspath);
  }
  create() {
    let phaser = this;
    this.engine = new Engine(this);
    this.sprite1 = this.physics.add.staticSprite(-128, (this.engine.gameHeight / 2) - 64, this.sprite1path).setScale(16);
    this.sprite2 = this.physics.add.staticSprite(this.engine.gameWidth + 128, (this.engine.gameHeight / 2) - 64, this.sprite2path).setScale(16);
    this.vs = this.physics.add.staticSprite(this.engine.gameWidth / 2, -128, this.vspath).setScale(16);
    this.sprite1.moveTween = this.tweens.add({
      targets: this.sprite1,
      x: this.sprite1.x + (this.engine.gameWidth / 2) - (this.engine.gameWidth / 6),
      ease: "Back.easeInOut",
      duration: 500,
      onComplete: () => {
        this.vs.moveTween.play();
      }
    });
    this.sprite2.moveTween = this.tweens.add({
      targets: this.sprite2,
      x: this.sprite2.x - (this.engine.gameWidth / 2) + (this.engine.gameWidth / 6),
      ease: "Back.easeInOut",
      duration: 500,
      paused: true,
      onComplete: () => {
        this.complete = true;
      }
    });
    this.vs.moveTween = this.tweens.add({
      targets: this.vs,
      y: this.vs.y + (this.engine.gameHeight / 2) + 64,
      ease: "Back.easeInOut",
      duration: 500,
      paused: true,
      onComplete: () => {
        this.sprite2.moveTween.play();
      }
    });
    this.input.on("pointerdown", () => {
      if (this.complete) {
        this.complete = false;
        phaser.scene.stop();
        phaser.scene.start(this.nextScene);
      }
    });
  }
  update() {

  }
}
