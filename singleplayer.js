// singleplayer.js
console.log("singleplayer.js loaded");

const TILE_SIZE = 64;

class SingleplayerScene extends Phaser.Scene {
  constructor() {
    super('SingleplayerScene');
  }

  preload() {
    // load the map JSON
    this.load.json('mapData', 'assets/maps/default-map.json');
  }

  create() {
    const map = this.cache.json.get('mapData');
    const rows = map.rows, cols = map.cols;
    this.grid = [];

    // center the game on-screen if desired
    // this.cameras.main.setScroll(...);

    // draw each tile
    for (let y = 0; y < rows; y++) {
      this.grid[y] = [];
      for (let x = 0; x < cols; x++) {
        // choose a color per owner code
        let fill = 0x444444;        // neutral
        if (map.tiles[y][x] === 1) fill = 0x22aa22; // player start
        if (map.tiles[y][x] === 2) fill = 0xaa2222; // AI start

        const rect = this.add.rectangle(
          x * TILE_SIZE + TILE_SIZE/2,
          y * TILE_SIZE + TILE_SIZE/2,
          TILE_SIZE - 2,
          TILE_SIZE - 2,
          fill
        ).setStrokeStyle(1, 0x888888);

        this.grid[y][x] = {
          owner: map.tiles[y][x],
          rect
        };
      }
    }

    // clicking to claim neutral tiles
    this.input.on('pointerdown', ptr => {
      const gx = Math.floor(ptr.x / TILE_SIZE);
      const gy = Math.floor(ptr.y / TILE_SIZE);
      if (
        gx >= 0 && gx < cols &&
        gy >= 0 && gy < rows
      ) {
        const cell = this.grid[gy][gx];
        if (cell.owner === 0) {
          cell.owner = 1;
          cell.rect.fillColor = 0x22aa22;
        }
      }
    });
  }
}

window.addEventListener('load', () => {
  new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'game-container',
    width: TILE_SIZE * 12,
    height: TILE_SIZE * 8,
    backgroundColor: '#222',
    scene: [ SingleplayerScene ]
  });
});
