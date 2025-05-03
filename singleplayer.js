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
    // if you want to pull initial owner data from JSON
    this.load.json('mapData', `assets/maps/${MAP_KEY}.json`);
  }

  create() {
    // grab our HUD div
    this.hud = document.getElementById('hud');
    this.hud.innerText = `Resources: ${this.resourceCount}`;

    // load or default map
    let map = this.cache.json.get('mapData');
    if (!map) {
      map = { rows:8, cols:12, tiles:Array(8).fill().map(() => Array(12).fill(0)) };
    }
    const rows = map.rows, cols = map.cols;

    // 8-direction offsets
    const dirs = [
      [ 1, 0], [-1, 0], [ 0, 1], [ 0,-1],
      [ 1, 1], [ 1,-1], [-1, 1], [-1,-1]
    ];
    const isAdjacent = (x, y) =>
      dirs.some(([dx, dy]) => {
        const nx = x + dx, ny = y + dy;
        return (
          nx >= 0 && nx < cols &&
          ny >= 0 && ny < rows &&
          this.grid[ny][nx].owner === 1
        );
      });

    // build our interactive grid
    for (let y = 0; y < rows; y++) {
      this.grid[y] = [];
      for (let x = 0; x < cols; x++) {
        const rect = this.add.rectangle(
          x * TILE_SIZE, y * TILE_SIZE,
          TILE_SIZE, TILE_SIZE,
          0xffffff, 0
        )
        .setOrigin(0)
        .setInteractive({ useHandCursor: true });

        // only allow expand/attack if adjacent to your territory
        rect.on('pointerdown', () => {
          const cell = this.grid[y][x];
          if (cell.owner !== 1 && isAdjacent(x, y)) {
            cell.owner = 1;
            rect.fillColor = 0x22aa22;
            rect.fillAlpha = 0.3;
          }
        });

        this.grid[y][x] = {
          owner: map.tiles[y][x],  // will be 0 unless your JSON marks it
          rect
        };
      }
    }

    // —————
    // place a starting spawn in the center:
    const spawnX = Math.floor(cols / 2);
    const spawnY = Math.floor(rows / 2);
    const spawnCell = this.grid[spawnY][spawnX];
    spawnCell.owner = 1;
    spawnCell.rect.fillColor = 0x22aa22;
    spawnCell.rect.fillAlpha = 0.3;
    // —————

    // every second, +1 resource per owned tile
    this.time.addEvent({
      delay: 1000, loop: true,
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
