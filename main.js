console.log("main.js loaded — launching GenericRTSGame");

const TILE_SIZE = 64;
const ROWS = 8, COLS = 12;

const config = {
  type: Phaser.AUTO,
  parent: 'game-container',      // <-- tell Phaser where to inject the canvas
  width: COLS * TILE_SIZE,
  height: ROWS * TILE_SIZE,
  backgroundColor: '#222',
  scene: [ BootScene, GameScene ]
};

class BootScene extends Phaser.Scene {
  constructor(){ super('BootScene'); }
  preload(){
    // nothing yet
  }
  create(){
    this.scene.start('GameScene');
  }
}

class GameScene extends Phaser.Scene {
  constructor(){ 
    super('GameScene');
    this.grid = [];
  }
  create(){
    for(let y=0; y<ROWS; y++){
      this.grid[y] = [];
      for(let x=0; x<COLS; x++){
        const rect = this.add.rectangle(
          x*TILE_SIZE + TILE_SIZE/2,
          y*TILE_SIZE + TILE_SIZE/2,
          TILE_SIZE-2, TILE_SIZE-2,
          0x444444
        ).setStrokeStyle(1, 0x888888);
        this.grid[y][x] = { owner:null, rect };
      }
    }
    this.input.on('pointerdown', ptr=>{
      const gx = Math.floor(ptr.x / TILE_SIZE);
      const gy = Math.floor(ptr.y / TILE_SIZE);
      if(gx>=0 && gx<COLS && gy>=0 && gy<ROWS){
        let cell = this.grid[gy][gx];
        if(cell.owner==='player'){
          cell.owner = null;
          cell.rect.fillColor = 0x444444;
        } else {
          cell.owner = 'player';
          cell.rect.fillColor = 0x22aa22;
        }
      }
    });
  }
}

new Phaser.Game(config);
