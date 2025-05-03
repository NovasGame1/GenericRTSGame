console.log("main.js loaded — GenericRTSGame");

// 1) Define your maps (0=neutral, 1=player, 2=enemy)
const MAPS = {
  default: [
    [0,0,0,0,0,0,0,0,0,0,0,0],
    [0,1,1,0,0,0,0,0,1,1,0,0],
    [0,1,0,0,0,0,0,0,0,1,0,0],
    [0,0,0,0,1,1,1,1,0,0,0,0],
    [0,0,0,0,1,0,0,1,0,0,0,0],
    [0,0,0,0,0,1,1,0,0,0,0,0],
    [0,0,1,1,0,0,0,0,1,1,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0]
  ]
};

// grid constants based on default map
const TILE_SIZE = 64;
const ROWS = MAPS.default.length;
const COLS = MAPS.default[0].length;

// Phaser config
const config = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: COLS * TILE_SIZE,
  height: ROWS * TILE_SIZE,
  backgroundColor: '#222',
  scene: [ MenuScene, GameScene ]
};

// 2) MenuScene fires GameScene with a mapName parameter
class MenuScene extends Phaser.Scene {
  constructor(){ super('MenuScene'); }
  create(){
    document.getElementById('singleplayer-btn')
      .addEventListener('click', () => {
        document.getElementById('menu').style.display = 'none';
        // pass in the map name to GameScene
        this.scene.start('GameScene', { mapName: 'default' });
      });
    document.getElementById('multiplayer-btn')
      .addEventListener('click', () => alert('Multiplayer coming soon!'));
    document.getElementById('settings-btn')
      .addEventListener('click', () => alert('Settings coming soon!'));
  }
}

// 3) GameScene reads mapName in init, then builds using that map
class GameScene extends Phaser.Scene {
  constructor(){ super('GameScene'); }
  init(data){
    // grab the map data (or fallback)
    this.mapData = MAPS[data.mapName] || MAPS.default;
  }
  create(){
    console.log("GameScene started with map:", this.mapData);
    this.grid = [];

    for (let y = 0; y < ROWS; y++){
      this.grid[y] = [];
      for (let x = 0; x < COLS; x++){
        // decide owner/color from mapData
        const code = this.mapData[y][x];
        let owner = null, color = 0x444444;
        if (code === 1) {
          owner = 'player';
          color = 0x22aa22;
        } else if (code === 2) {
          owner = 'enemy';
          color = 0xaa2222;
        }

        const rect = this.add.rectangle(
          x * TILE_SIZE + TILE_SIZE/2,
          y * TILE_SIZE + TILE_SIZE/2,
          TILE_SIZE - 2,
          TILE_SIZE - 2,
          color
        ).setStrokeStyle(1, 0x888888);

        this.grid[y][x] = { owner, rect };
      }
    }

    // still keep click-to-toggle if you want to reassign during play
    this.input.on('pointerdown', ptr => {
      const gx = Math.floor(ptr.x / TILE_SIZE);
      const gy = Math.floor(ptr.y / TILE_SIZE);
      if (gx >= 0 && gx < COLS && gy >= 0 && gy < ROWS){
        const cell = this.grid[gy][gx];
        cell.owner = cell.owner === 'player' ? null : 'player';
        cell.rect.fillColor = cell.owner === 'player'
          ? 0x22aa22
          : (cell.owner === 'enemy' ? 0xaa2222 : 0x444444);
      }
    });
  }
}

// launch the game
new Phaser.Game(config);
