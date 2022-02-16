/*^*^*^*^*^*^*^*
Engine.js
A phaser-based game engine with tools.
*^*^*^*^*^*^*^*/

class Engine {
  constructor(phaser) {
    this.phaser = phaser;
    this.mouseDown = false;
    this.gameWidth = this.sys.game.canvas.width;
    this.gameHeight = this.sys.game.canvas.height;
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
  addAnimation(name, frameRate, repeat, ...keys) {
    // Adds a animation
    let keyArray = [];
    for (var i = 0; i < keys.length; i++) {
      keyArray.push({key: keys[i]});
    }
    this.phaser.anims.create({
      key: name,
      frames: keyArray,
      frameRate: frameRate,
      repeat: repeat ? -1 : 1
    });
  }
}
