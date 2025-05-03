console.log("singleplayer.js loaded — GenericRTSGame");

const TILE_SIZE = 64;
const MAP_KEY   = 'default-map';
const RESOURCE_INTERVAL = 1000; // ms

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
    this.resources = 0;
  }

  preload() {
    // load JSON if you want initial owner states
    this.load.json('mapData', `assets/maps/${MAP_KEY}.json`);
  }

  create() {
    // pull JSON (or default empty)
    let map = this.cache.json.get('mapData');
    if (!map) {
      map = { rows: 8, cols: 12, tiles: Array(8).fill().map(() => Array(12).fill(0)) };
    }
    const { rows, cols } = map;

    // draw transparent interactive tiles
    for (let y = 0; y < rows; y++) {
      this.grid[y] = [];
      for (let x = 0; x < cols; x++) {
        const rect = this.add.rectangle(
          x * TILE_SIZE, y * TILE_SIZE,
          TILE_SIZE, TILE_SIZE, 0xffffff, 0
        )
        .setOrigin(0)
        .setInteractive({ useHandCursor: true });

        rect.on('pointerdown', () => {
          // toggle claimed (owner === 1)
          const cell = this.grid[y][x];
          cell.claimed = !cell.claimed;
          rect.fillColor = 0x22aa22;
          rect.fillAlpha = cell.claimed ? 0.3 : 0;
        });

        this.grid[y][x] = { rect, claimed: map.tiles[y][x] === 1 };
      }
    }

    // set up resource tick
    this.time.addEvent({
      delay: RESOURCE_INTERVAL,
      loop: true,
      callback: () => {
        // count claimed tiles
        let count = 0;
        for (let row of this.grid) {
          for (let cell of row) {
            if (cell.claimed) count++;
          }
        }
        this.resources += count;
        // update HUD
        document.getElementById('hud').innerText = `Resources: ${this.resources}`;
      }
    });

    // zoom with mouse wheel
    this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY) => {
      const cam = this.cameras.main;
      let z = cam.zoom + (deltaY > 0 ? -0.1 : 0.1);
      z = Phaser.Math.Clamp(z, 0.5, 2);
      cam.setZoom(z);
    });
  }
}

new Phaser.Game(config);
