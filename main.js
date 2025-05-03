console.log("main.js loaded — GenericRTSGame");

// constants must match your JSON
const TILE_SIZE = 64;
const ROWS = 8, COLS = 12;

const config = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: COLS * TILE_SIZE,
  height: ROWS * TILE_SIZE,
  backgroundColor: '#222',
  scene: [ MenuScene, GameScene ]
};

// MENU SCENE: pass the map key into GameScene
class MenuScene extends Phaser.Scene {
  constructor(){ super('MenuScene'); }
  create(){
    const menu = document.getElementById('menu');
    document.getElementById('singleplayer-btn')
      .addEventListener('click', () => {
        menu.style.display = 'none';
        // start GameScene and hand it { mapKey: 'map1' }
        this.scene.start('GameScene', { mapKey: 'map1' });
      });
    document.getElementById('multiplayer-btn')
      .addEventListener('click', () => alert('Multiplayer coming soon!'));
    document.getElementById('settings-btn')
      .addEventListener('click', () => alert('Settings coming soon!'));
  }
}

// GAME SCENE: load JSON then draw grid from it
class GameScene extends Phaser.Scene {
  constructor(){ 
    super('GameScene');
    this.grid = [];
  }

  // grab the data passed in
  init(data){
    this.mapKey = data.mapKey || 'map1';
  }

  preload(){
    // load maps/<mapKey>.json as 'mapData'
    this.load.json('mapData', `maps/${this.mapKey}.json`);
  }

  create(){
    // pull in the JSON
    const mapData = this.cache.json.get('mapData');
    console.log('Loaded map:', mapData.name);

    // optional: verify dimensions match
    if (mapData.rows !== ROWS || mapData.cols !== COLS) {
      console.warn(`Map size (${mapData.rows}×${mapData.cols}) doesn’t match constants ${ROWS}×${COLS}`);
    }

    // build the grid from mapData.tiles
    for (let y = 0; y < ROWS; y++){
      this.grid[y] = [];
      for (let x = 0; x < COLS; x++){
        const ownerFlag = mapData.tiles[y][x];
        const rect = this.add.rectangle(
          x * TILE_SIZE + TILE_SIZE/2,
          y * TILE_SIZE + TILE_SIZE/2,
          TILE_SIZE - 2, TILE_SIZE - 2,
          0x444444
        ).setStrokeStyle(1, 0x888888);

        // assign color based on ownerFlag
        if (ownerFlag === 1)      rect.fillColor = 0x22aa22; // player
        else if (ownerFlag === 2) rect.fillColor = 0xaa2222; // enemy
        else                      rect.fillColor = 0x444444; // neutral

        this.grid[y][x] = { owner: ownerFlag, rect };
      }
    }

    // still let player toggle tiles if you like
    this.input.on('pointerdown', ptr => {
      const gx = Math.floor(ptr.x / TILE_SIZE);
      const gy = Math.floor(ptr.y / TILE_SIZE);
      if (gx >= 0 && gx < COLS && gy >= 0 && gy < ROWS) {
        const cell = this.grid[gy][gx];
        // flip between neutral(0) and player(1)
        cell.owner = cell.owner === 1 ? 0 : 1;
        cell.rect.fillColor = cell.owner === 1 ? 0x22aa22 : 0x444444;
      }
    });
  }
}

new Phaser.Game(config);
