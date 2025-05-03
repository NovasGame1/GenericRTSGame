console.log("singleplayer.js loaded — GenericRTSGame");

// constants
const TILE_SIZE = 64;
const MAP_KEY   = 'default-map';  

const config = {
  type: Phaser.AUTO,
  parent: 'sp-container',
  width: TILE_SIZE * 12,
  height: TILE_SIZE * 8,
  backgroundColor: '#000',      // black behind the map
  scene: [ SPScene ]
};

class SPScene extends Phaser.Scene {
  constructor() {
    super('SPScene');
    this.grid = [];
  }

  preload() {
    // load your JSON and your earth map PNG
    this.load.json('mapData', `assets/maps/${MAP_KEY}.json`);
    this.load.image('mapImg', `assets/maps/${MAP_KEY}.png`);
  }

  create() {
    const map = this.cache.json.get('mapData');
    const rows = map.rows, cols = map.cols;

    // 1) draw the full-size map image
    this.add.image(0, 0, 'mapImg')
      .setOrigin(0)
      .setDisplaySize(cols * TILE_SIZE, rows * TILE_SIZE);

    // 2) overlay invisible, interactive tiles
    for (let y = 0; y < rows; y++) {
      this.grid[y] = [];
      for (let x = 0; x < cols; x++) {
        // invisible rectangle exactly covering each tile
        const rect = this.add.rectangle(
          x * TILE_SIZE,
          y * TILE_SIZE,
          TILE_SIZE,
          TILE_SIZE,
          0xffffff,    // color doesn’t matter
          0            // fully transparent
        )
        .setOrigin(0)
        .setInteractive({ useHandCursor: true });

        // store state
        this.grid[y][x] = { owner: map.tiles[y][x], rect };

        // on click: toggle between neutral (0) and player (1)
        rect.on('pointerdown', () => {
          const cell = this.grid[y][x];
          cell.owner = cell.owner === 1 ? 0 : 1;

          // show a semi-transparent overlay when owned
          if (cell.owner === 1) {
            rect.fillColor = 0x22aa22;   // green
            rect.fillAlpha = 0.3;
          } else {
            rect.fillAlpha = 0;          // back to invisible
          }
        });
      }
    }
  }
}

new Phaser.Game(config);
