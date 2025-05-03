console.log("main.js loaded — launching GenericRTSGame");

const TILE_SIZE = 64, ROWS = 8, COLS = 12;

const config = {
  type: Phaser.AUTO,
  // parent: 'game-container',    // ← temporarily disabled
  width: COLS * TILE_SIZE,
  height: ROWS * TILE_SIZE,
  backgroundColor: '#222',
  scene: {
    preload() {
      console.log("preload");
    },
    create() {
      console.log("create");
      // draw a quick “hello” to prove we’re in the right place
      this.add.text(10, 10, "Game loaded", { font: "16px Arial", fill: "#ffffff" });

      // now build the grid
      this.grid = [];
      for (let y = 0; y < ROWS; y++) {
        this.grid[y] = [];
        for (let x = 0; x < COLS; x++) {
          const rect = this.add.rectangle(
            x * TILE_SIZE + TILE_SIZE/2,
            y * TILE_SIZE + TILE_SIZE/2,
            TILE_SIZE - 2,
            TILE_SIZE - 2,
            0x444444
          ).setStrokeStyle(1, 0x888888);
          this.grid[y][x] = { owner: null, rect };
        }
      }

      // click to toggle
      this.input.on('pointerdown', ptr => {
        const gx = Math.floor(ptr.x / TILE_SIZE);
        const gy = Math.floor(ptr.y / TILE_SIZE);
        if (gx >= 0 && gx < COLS && gy >= 0 && gy < ROWS) {
          const cell = this.grid[gy][gx];
          cell.owner = cell.owner === 'player' ? null : 'player';
          cell.rect.fillColor = cell.owner === 'player' ? 0x22aa22 : 0x444444;
        }
      });
    }
  }
};

new Phaser.Game(config);
