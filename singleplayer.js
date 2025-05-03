console.log("singleplayer.js loaded — GenericRTSGame");

const TILE_SIZE = 64;
const MAP_KEY   = 'default-map';  // still used for loading JSON

const config = {
  type: Phaser.AUTO,
  parent: 'sp-container',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: TILE_SIZE * 12,
    height: TILE_SIZE * 8,
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
    // load your map JSON (if it exists)
    this.load.json('mapData', `assets/maps/${MAP_KEY}.json`);
  }

  create() {
    // pull in JSON or default to all-neutral
    let map = this.cache.json.get('mapData');
    if (!map) {
      map = {
        rows: 8,
        cols: 12,
        tiles: Array(8).fill().map(() => Array(12).fill(0))
      };
    }
    const { rows, cols, tiles } = map;

    // HUD: show resources
    this.resourceText = this.add.text(10, 10, 'Gold: 0', {
      fontSize: '24px',
      fill: '#ffff00',
      fontFamily: 'Arial'
    }).setScrollFactor(0).setDepth(5);

    // every second, collect +1 per owned tile
    this.time.addEvent({
      delay: 1000, loop: true, callback: () => {
        let ownedCount = 0;
        for (let y = 0; y < rows; y++) {
          for (let x = 0; x < cols; x++) {
            if (this.grid[y][x].owner === 1) ownedCount++;
          }
        }
        this.resources += ownedCount;
        this.resourceText.setText(`Gold: ${this.resources}`);
      }
    });

    // draw transparent, interactive tiles
    for (let y = 0; y < rows; y++) {
      this.grid[y] = [];
      for (let x = 0; x < cols; x++) {
        const rect = this.add.rectangle(
          x * TILE_SIZE,
          y * TILE_SIZE,
          TILE_SIZE,
          TILE_SIZE,
          0xffffff, 0
        )
        .setOrigin(0)
        .setInteractive({ useHandCursor: true });

        // store owner state (0=neutral,1=you,2=AI)
        this.grid[y][x] = { owner: tiles[y][x], rect };

        // click handler: expand/attack rules
        rect.on('pointerdown', () => {
          const cell = this.grid[y][x];
          if (cell.owner === 1) {
            // clicking your own: do nothing or optionally unclaim
            return;
          }
          // only allow if adjacent to one of your tiles
          if (this.isAdjacentToPlayer(x, y)) {
            cell.owner = 1;
            rect.fillColor = 0x22aa22;
            rect.fillAlpha = 0.3;
          }
        });
      }
    }
  }

  // helper: check N/E/S/W for any tile you own
  isAdjacentToPlayer(x, y) {
    const deltas = [ [1,0],[-1,0],[0,1],[0,-1] ];
    for (let [dx,dy] of deltas) {
      const nx = x + dx, ny = y + dy;
      if (ny>=0 && ny < this.grid.length &&
          nx>=0 && nx < this.grid[0].length &&
          this.grid[ny][nx].owner === 1) {
        return true;
      }
    }
    return false;
  }
}

new Phaser.Game(config);
