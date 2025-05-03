console.log("main.js loaded — GenericRTSGame");

// basic grid constants (unused on index.html until you start GameScene)
const TILE_SIZE = 64, ROWS = 8, COLS = 12;

// Phaser config stays the same
const config = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: COLS * TILE_SIZE,
  height: ROWS * TILE_SIZE,
  backgroundColor: '#222',
  scene: [ MenuScene, GameScene ]
};

// MENU SCENE is now just a stub (we handle the button redirect in index.html)
class MenuScene extends Phaser.Scene {
  constructor(){ super('MenuScene'); }
  create(){
    // nothing here anymore
  }
}

// MAIN GAME SCENE (runs if you ever call scene.start('GameScene'))
class GameScene extends Phaser.Scene {
  constructor(){ 
    super('GameScene');
    this.grid = [];
  }
  create(){
    console.log("GameScene started");
    for (let y = 0; y < ROWS; y++){
      this.grid[y] = [];
      for (let x = 0; x < COLS; x++){
        const rect = this.add.rectangle(
          x * TILE_SIZE + TILE_SIZE/2,
          y * TILE_SIZE + TILE_SIZE/2,
          TILE_SIZE-2, TILE_SIZE-2,
          0x444444
        ).setStrokeStyle(1, 0x888888);
        this.grid[y][x] = { owner: null, rect };
      }
    }
    this.input.on('pointerdown', ptr => {
      const gx = Math.floor(ptr.x / TILE_SIZE);
      const gy = Math.floor(ptr.y / TILE_SIZE);
      if (gx>=0 && gx<COLS && gy>=0 && gy<ROWS){
        const cell = this.grid[gy][gx];
        cell.owner = cell.owner === 'player' ? null : 'player';
        cell.rect.fillColor = cell.owner === 'player' ? 0x22aa22 : 0x444444;
      }
    });
  }
}

new Phaser.Game(config);
