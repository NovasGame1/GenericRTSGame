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
    this.spawnSet = false;
  }

  preload() {
    // we only need the JSON for dimensions
    this.load.json('mapData', `assets/maps/${MAP_KEY}.json`);
  }

  create() {
    // hook up the HUD
    this.hud = document.getElementById('hud');
    this.hud.innerText = `Resources: ${this.resourceCount}`;

    // get map size
    let map = this.cache.json.get('mapData');
    if (!map) map = { rows: 8, cols: 12 };
    const rows = map.rows, cols = map.cols;

    // allow camera to zoom/pan inside the map bounds
    this.cameras.main.setBounds(0, 0, cols * TILE_SIZE, rows * TILE_SIZE);

    // adjacency helper
    const isAdjacent = (x, y) =>
      [[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy]) => {
        const nx = x + dx, ny = y + dy;
        return nx >= 0 && nx < cols && ny >= 0 && ny < rows
            && this.grid[ny][nx].owner === 1;
      });

    // build an empty grid (all neutral)
    for (let y = 0; y < rows; y++) {
      this.grid[y] = [];
      for (let x = 0; x < cols; x++) {
        const rect = this.add.rectangle(
          x * TILE_SIZE, 
          y * TILE_SIZE,
          TILE_SIZE, TILE_SIZE,
          0xffffff, 0     // invisible by default
        )
        .setOrigin(0)
        .setInteractive({ useHandCursor: true });

        rect.on('pointerdown', () => {
          const cell = this.grid[y][x];

          if (!this.spawnSet) {
            // first click = your spawn
            cell.owner = 1;
            rect.fillColor = 0x22aa22;
            rect.fillAlpha = 0.3;
            this.spawnSet = true;
          } else {
            // subsequent clicks = expand/attack only if adjacent
            if (cell.owner !== 1 && isAdjacent(x, y)) {
              cell.owner = 1;
              rect.fillColor = 0x22aa22;
              rect.fillAlpha = 0.3;
            }
          }
        });

        this.grid[y][x] = { owner: 0, rect };
      }
    }

    // every second, generate +1 per owned tile
    this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => {
        let owned = 0;
        for (let row of this.grid) {
          for (let cell of row) {
            if (cell.owner === 1) owned++;
          }
        }
        this.resourceCount += owned;
        this.hud.innerText = `Resources: ${this.resourceCount}`;
      }
    });

    // zoom with mouse wheel
    this.input.on('wheel', (_pointer, _objs, deltaX, deltaY) => {
      const cam = this.cameras.main;
      let newZoom = cam.zoom - deltaY * 0.001;
      newZoom = Phaser.Math.Clamp(newZoom, 0.5, 2);
      cam.setZoom(newZoom);
    });
  }
}

new Phaser.Game(config);
