console.log("main.js loaded — GenericRTSGame");

// basic grid constants
const TILE_SIZE = 64, ROWS = 8, COLS = 12;

// game config, pointing at our container
const config = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: COLS * TILE_SIZE,
  height: ROWS * TILE_SIZE,
  backgroundColor: '#222',
  scene: [ MenuScene, GameScene ]
};

// MENU SCENE
class MenuScene extends Phaser.Scene {
  constructor(){ super('MenuScene'); }
  create(){
    // nothing in canvas yet; menu is HTML overlay
    // hook up DOM buttons:
    document.getElementById('singleplayer-btn')
      .addEventListener('click', () => {
        document.getElementById('menu').style.display = 'none';
        this.scene.start('GameScene');
      });
    document.getElementById('multiplayer-btn')
      .addEventListener('click', () => {
        alert('Multiplayer coming soon!');
      });
    document.getElementById('settings-btn')
      .addEventListener('click', () => {
        alert('Settings coming soon!');
      });
  }
}

// MAIN GAME SCENE
class GameScene extends Phaser.Scene {
  constructor(){ 
    super('GameScene');
    this.grid = [];
  }
  create(){
    console.log("GameScene started");
    // build the 12×8 grid
    for (let y = 0; y < ROWS; y++){
      this.grid[y] = [];
      for (let x = 0; x < COLS; x++){
        const rect = this.add.rectangle(
          x*TILE_SIZE + TILE_SIZE/2,
          y*TILE_SIZE + TILE_SIZE/2,
          TILE_SIZE-2, TILE_SIZE-2,
          0x444444
        ).setStrokeStyle(1, 0x888888);
        this.grid[y][x] = { owner: null, rect };
      }
    }
    // click to claim
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
