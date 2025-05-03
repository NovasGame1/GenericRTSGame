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
    height: 512,
  },
  transparent: true,
  scene: [ SPScene ],
};

class SPScene extends Phaser.Scene {
  constructor() {
    super('SPScene');
    this.grid = [];
    this.resourceCount = 0;
    this.hasSpawn = false;
  }

  preload() {
    // load your JSON if you have one, otherwise we'll default to all 0’s
    this.load.json('mapData', `assets/maps/${MAP_KEY}.json`);
  }

  create() {
    // hook up the HUD
    this.hud = document.getElementById('hud');
    this.hud.innerText = `Resources: ${this.resourceCount}`;

    // pull in or default map data
    let map = this.cache.json.get('mapData');
    if (!map) {
      map = { rows: 8, cols: 12, tiles: Array(8).fill().map(() => Array(12).fill(0)) };
    }
    const rows = map.rows, cols = map.cols;

    // set camera bounds & default zoom
    this.cameras.main.setBounds(0, 0, cols * TILE_SIZE, rows * TILE_SIZE);
    this.cameras.main.setZoom(1);

    // zoom in/out on mouse wheel
    this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY) => {
      const cam = this.cameras.main;
      if (deltaY > 0) {
        cam.zoom = Math.max(cam.zoom - 0.1, 0.5);
      } else if (deltaY < 0) {
        cam.zoom = Math.min(cam.zoom + 0.1, 2);
      }
    });

    // helper to check if a tile is next to your territory
    const isAdjacent = (x, y) => {
      return [
        [1,0],[-1,0],[0,1],[0,-1]
      ].some(([dx,dy]) => {
        const nx = x + dx, ny = y + dy;
        return nx >= 0 && nx < cols
            && ny >= 0 && ny < rows
            && this.grid[ny][nx].owner === 1;
      });
    };

    // build the interactive overlay grid
    for (let y = 0; y < rows; y++) {
      this.grid[y] = [];
      for (let x = 0; x < cols; x++) {
        const rect = this.add.rectangle(
          x * TILE_SIZE,
          y * TILE_SIZE,
          TILE_SIZE,
          TILE_SIZE,
          0xffffff,
          0        // start fully transparent
        )
        .setOrigin(0)
        .setInteractive({ useHandCursor: true });

        rect.on('pointerdown', () => {
          const cell = this.grid[y][x];
          if (!this.hasSpawn) {
            // first click = spawn point
            cell.owner = 1;
            rect.fillColor = 0x22aa22;
            rect.fillAlpha = 0.3;
            this.hasSpawn = true;
          } else if (cell.owner !== 1 && isAdjacent(x, y)) {
            // subsequent clicks = valid expansion
            cell.owner = 1;
            rect.fillColor = 0x22aa22;
            rect.fillAlpha = 0.3;
          }
        });

        this.grid[y][x] = { owner: map.tiles[y][x], rect };
      }
    }

    // resource generation: +1 per owned tile every second
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
  }
}

new Phaser.Game(config);
