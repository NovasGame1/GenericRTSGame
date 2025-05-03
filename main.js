let game;

window.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded: attaching menu button listeners');

  document
    .getElementById('singleplayer-btn')
    .addEventListener('click', () => {
      console.log('Singleplayer clicked');
      document.getElementById('menu').style.display = 'none';
      game.scene.start('GameScene', { mapName: 'default-map' });
    });

  document
    .getElementById('multiplayer-btn')
    .addEventListener('click', () => alert('Multiplayer coming soon!'));

  document
    .getElementById('settings-btn')
    .addEventListener('click', () => alert('Settings coming soon!'));
});

const TILE_SIZE = 64;
const DEFAULT_ROWS = 8, DEFAULT_COLS = 12;

const config = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: TILE_SIZE * DEFAULT_COLS,
  height: TILE_SIZE * DEFAULT_ROWS,
  backgroundColor: '#222',
  scene: [ MenuScene, GameScene ]
};

class MenuScene extends Phaser.Scene {
  constructor(){ super('MenuScene'); }
  create(){
    console.log('MenuScene created');
  }
}

class GameScene extends Phaser.Scene {
  constructor(){ super('GameScene'); }
  init(data) {
    this.mapName = data.mapName || 'default-map';
    console.log('GameScene init, mapName =', this.mapName);
  }

  preload() {
    const url = `assets/maps/${this.mapName}.json`;
    console.log('Preloading map JSON from', url);
    this.load.json('mapData', url);

    // log success or failure
    this.load.on('filecomplete-json-mapData', () => {
      console.log('✅ Map JSON loaded successfully');
    });
    this.load.on('loaderror', (file) => {
      if (file.type === 'json') {
        console.error('❌ Failed to load map JSON:', file.src);
      }
    });
  }

  create() {
    let map = this.cache.json.get('mapData');
    if (!map) {
      console.error('⚠️  mapData is undefined—using fallback empty map');
      // fallback empty map
      map = {
        rows: DEFAULT_ROWS,
        cols: DEFAULT_COLS,
        tiles: Array.from({ length: DEFAULT_ROWS }, () =>
          Array.from({ length: DEFAULT_COLS }, () => 0)
        )
      };
    }

    console.log('Creating map:', map);

    const rows = map.rows, cols = map.cols;
    this.grid = [];

    for (let y = 0; y < rows; y++) {
      this.grid[y] = [];
      for (let x = 0; x < cols; x++) {
        const code = map.tiles[y][x];
        let fill = code === 1 ? 0x22aa22
                 : code === 2 ? 0xaa2222
                 : 0x444444;

        const rect = this.add.rectangle(
          x * TILE_SIZE + TILE_SIZE/2,
          y * TILE_SIZE + TILE_SIZE/2,
          TILE_SIZE - 2,
          TILE_SIZE - 2,
          fill
        ).setStrokeStyle(1, 0x888888);

        this.grid[y][x] = { owner: code, rect };
      }
    }

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

game = new Phaser.Game(config);
