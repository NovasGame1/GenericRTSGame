console.log("main.js loaded — GenericRTSGame");

const TILE_SIZE = 64;

// Phaser config
const config = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: TILE_SIZE * 12,  // must match your maps’ cols
  height: TILE_SIZE * 8,  // must match your maps’ rows
  backgroundColor: '#222',
  scene: [ MenuScene, GameScene ]
};

// MENU — choose singleplayer → passes mapName to GameScene
class MenuScene extends Phaser.Scene {
  constructor(){ super('MenuScene'); }
  create() {
    document.getElementById('singleplayer-btn')
      .addEventListener('click', () => {
        document.getElementById('menu').style.display = 'none';
        // here we pick our map file key:
        this.scene.start('GameScene', { mapName: 'default-map' });
      });
    document.getElementById('multiplayer-btn')
      .addEventListener('click', () => alert('Multiplayer coming soon!'));
    document.getElementById('settings-btn')
      .addEventListener('click', () => alert('Settings coming soon!'));
  }
}

// GAME — loads JSON then draws
class GameScene extends Phaser.Scene {
  constructor(){ super('GameScene'); }

  init(data) {
    this.mapName = data.mapName || 'default-map';
  }

  preload() {
    // load the map JSON from assets/maps/
    this.load.json('mapData', `assets/maps/${this.mapName}.json`);
  }

  create() {
    // grab it out of cache
    const map = this.cache.json.get('mapData');
    const rows = map.rows, cols = map.cols;
    this.grid = [];

    for (let y = 0; y < rows; y++) {
      this.grid[y] = [];
      for (let x = 0; x < cols; x++) {
        // owner code → color
        let fill = 0x444444;          // neutral
        if (map.tiles[y][x] === 1) fill = 0x22aa22; // player
        if (map.tiles[y][x] === 2) fill = 0xaa2222; // AI

        const rect = this.add.rectangle(
          x * TILE_SIZE + TILE_SIZE/2,
          y * TILE_SIZE + TILE_SIZE/2,
          TILE_SIZE - 2, TILE_SIZE - 2,
          fill
        ).setStrokeStyle(1, 0x888888);

        this.grid[y][x] = { owner: map.tiles[y][x], rect };
      }
    }

    // clicking still toggles player-control on neutral only
    this.input.on('pointerdown', ptr => {
      const gx = Math.floor(ptr.x / TILE_SIZE);
      const gy = Math.floor(ptr.y / TILE_SIZE);
      if (gx >= 0 && gx < cols && gy >= 0 && gy < rows) {
        let cell = this.grid[gy][gx];
        if (cell.owner === 0) {
          cell.owner = 1;
          cell.rect.fillColor = 0x22aa22;
        }
      }
    });
  }
}

new Phaser.Game(config);
