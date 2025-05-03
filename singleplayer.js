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
    this.resourceCount = 0;
  }

  preload() {
    this.load.json('mapData', `assets/maps/${MAP_KEY}.json`);
  }

  create() {
    // grab the HUD element
    this.hud = document.getElementById('hud');
    this.hud.innerText = `Resources: ${this.resourceCount}`;

    // load or default map data
    let map = this.cache.json.get('mapData');
    if (!map) {
      map = { rows: 8, cols: 12, tiles: Array(8).fill().map(() => Array(12).fill(0)) };
    }
    const rows = map.rows, cols = map.cols;

    // helper to check adjacency
    const isAdjacent = (x, y) => {
      const dirs = [[1,0],[-1,0],[0,1],[0,-1]];
      return dirs.some(([dx,dy]) => {
        const nx = x+dx, ny = y+dy;
        return nx>=0 && nx<cols && ny>=0 && ny<rows && this.grid[ny][nx].owner === 1;
      });
    };

    // set up the clickable grid
    for (let y = 0; y < rows; y++) {
      this.grid[y] = [];
      for (let x = 0; x < cols; x++) {
        const rect = this.add.rectangle(
          x * TILE_SIZE,
          y * TILE_SIZE,
          TILE_SIZE,
          TILE_SIZE,
          0xffffff,
          0
        )
        .setOrigin(0)
        .setInteractive({ useHandCursor: true });

        rect.on('pointerdown', () => {
          const cell = this.grid[y][x];
          // only expand/attack if adjacent to your territory
          if (cell.owner !== 1 && isAdjacent(x,y)) {
            cell.owner = 1;
            rect.fillColor = 0x22aa22;
            rect.fillAlpha = 0.3;
          }
        });

        this.grid[y][x] = { owner: map.tiles[y][x], rect };
      }
    }

    // every second, generate resources
    this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => {
        // +1 per owned tile
        let owned = 0;
        for (let row of this.grid) {
          for (let cell of row) if (cell.owner === 1) owned++;
        }
        this.resourceCount += owned;
        this.hud.innerText = `Resources: ${this.resourceCount}`;
      }
    });
  }
}

new Phaser.Game(config);
