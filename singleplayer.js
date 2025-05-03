console.log("singleplayer.js loaded — GenericRTSGame");

// your tile size and map key
const TILE_SIZE = 64;
const MAP_KEY   = 'default-map';

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
    // load JSON and your Earth map PNG
    this.load.json('mapData', `assets/maps/${MAP_KEY}.json`);
    this.load.image('mapImg', `assets/maps/${MAP_KEY}.png`);
  }

  create() {
    const map = this.cache.json.get('mapData');
    const rows = map.rows, cols = map.cols;

    // draw your full-screen map image
    this.add.image(0, 0, 'mapImg')
      .setOrigin(0)
      .setDisplaySize(cols * TILE_SIZE, rows * TILE_SIZE);

    // overlay invisible tile-sized rectangles
    for (let y = 0; y < rows; y++) {
      this.grid[y] = [];
      for (let x = 0; x < cols; x++) {

        // create a fully transparent fill + a faint stroke
        const rect = this.add.rectangle(
          x * TILE_SIZE,
          y * TILE_SIZE,
          TILE_SIZE,
          TILE_SIZE
        )
        .setOrigin(0)
        .setFillStyle(0x000000, 0)          // fill alpha = 0
        .setStrokeStyle(1, 0xffffff, 0.2)   // light grid lines
        .setInteractive();

        this.grid[y][x] = { owner: map.tiles[y][x], rect };

        rect.on('pointerdown', () => {
          const cell = this.grid[y][x];
          // toggle neutral ↔ player
          cell.owner = cell.owner === 1 ? 0 : 1;

          if (cell.owner === 1) {
            // green tint when claimed
            rect.setFillStyle(0x22aa22, 0.4);
          } else {
            // back to transparent
            rect.setFillStyle(0x000000, 0);
          }
        });
      }
    }
  }
}

new Phaser.Game(config);
