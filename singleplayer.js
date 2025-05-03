console.log("singleplayer.js loaded — GenericRTSGame");

// match your map JSON & PNG layout
const TILE_SIZE = 64;
const MAP_KEY   = 'default-map';  // change this to load a different map

const config = {
  type: Phaser.AUTO,
  parent: 'sp-container',
  width: TILE_SIZE * 12,
  height: TILE_SIZE * 8,
  backgroundColor: '#222',
  scene: [ SPScene ]
};

class SPScene extends Phaser.Scene {
  constructor() {
    super('SPScene');
    this.grid = [];
  }

  preload() {
    // 1) load the map data
    this.load.json('mapData', `assets/maps/${MAP_KEY}.json`);
    // 2) load the static map image
    this.load.image('mapImg', `assets/maps/${MAP_KEY}.png`);
  }

  create() {
    // pull in your JSON
    const map = this.cache.json.get('mapData');
    const rows = map.rows, cols = map.cols;

    // draw the background map image
    this.add.image(0, 0, 'mapImg')
      .setOrigin(0)
      .setDisplaySize(cols * TILE_SIZE, rows * TILE_SIZE);

    // overlay clickable tiles
    for (let y = 0; y < rows; y++) {
      this.grid[y] = [];
      for (let x = 0; x < cols; x++) {
        // start color based on JSON owner code
        const owner = map.tiles[y][x];
        const baseColor = owner === 1 ? 0x22aa22
                         : owner === 2 ? 0xaa2222
                         :               0x444444;

        const rect = this.add.rectangle(
          x * TILE_SIZE + TILE_SIZE/2,
          y * TILE_SIZE + TILE_SIZE/2,
          TILE_SIZE - 2,
          TILE_SIZE - 2,
          baseColor,
          0.3                           // semi-transparent overlay
        ).setStrokeStyle(1, 0x888888);

        // store state
        this.grid[y][x] = { owner, rect };

        // make it interactive
        rect.setInteractive();
        rect.on('pointerdown', () => {
          // toggle between neutral (0) and player (1)
          const cell = this.grid[y][x];
          cell.owner = cell.owner === 1 ? 0 : 1;
          rect.fillColor = cell.owner === 1 ? 0x22aa22 : 0x444444;
        });
      }
    }
  }
}

new Phaser.Game(config);
