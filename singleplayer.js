console.log("singleplayer.js loaded — GenericRTSGame");

const TILE_SIZE = 64;
const MAP_KEY   = 'default-map';  

const config = {
  type: Phaser.AUTO,
  scale: {
    parent: 'sp-container',
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 768,
    height: 512
  },
  transparent: true,
  scene: [ SPScene ]
};

class SPScene extends Phaser.Scene {
  constructor() {
    super('SPScene');
    this.grid = [];
  }

  preload() {
    // load JSON if you still want initial owner data
    this.load.json('mapData', `assets/maps/${MAP_KEY}.json`);
  }

  create() {
    // pull JSON (or default to all zeroes)
    let map = this.cache.json.get('mapData');
    if (!map) {
      map = { rows: 8, cols: 12, tiles: Array(8).fill().map(() => Array(12).fill(0)) };
    }

    const rows = map.rows, cols = map.cols;

    // overlay fully transparent, interactive tiles
    for (let y = 0; y < rows; y++) {
      this.grid[y] = [];
      for (let x = 0; x < cols; x++) {
        const rect = this.add.rectangle(
          x * TILE_SIZE,
          y * TILE_SIZE,
          TILE_SIZE,
          TILE_SIZE,
          0xffffff,
          0      // invisible until clicked
        )
        .setOrigin(0)
        .setInteractive({ useHandCursor: true });

        rect.on('pointerdown', () => {
          rect.fillAlpha = rect.fillAlpha ? 0 : 0.3;
          rect.fillColor = 0x22aa22;
        });

        this.grid[y][x] = { rect, owner: map.tiles[y][x] };
      }
    }
  }
}

new Phaser.Game(config);
