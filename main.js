// expose game instance so we can call .scene.start from outside
let game;

window.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded: attaching menu button listeners');

  // Singleplayer: hide menu & start GameScene with a map name
  document
    .getElementById('singleplayer-btn')
    .addEventListener('click', () => {
      console.log('Singleplayer clicked');
      document.getElementById('menu').style.display = 'none';
      game.scene.start('GameScene', { mapName: 'default-map' });
    });

  // Placeholder handlers
  document
    .getElementById('multiplayer-btn')
    .addEventListener('click', () => alert('Multiplayer coming soon!'));

  document
    .getElementById('settings-btn')
    .addEventListener('click', () => alert('Settings coming soon!'));
});

const TILE_SIZE = 64;

const config = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: TILE_SIZE * 12,  // should match your map cols
  height: TILE_SIZE * 8,  // should match your map rows
  backgroundColor: '#222',
  scene: [MenuScene, GameScene]
};

// define scenes…

class MenuScene extends Phaser.Scene {
  constructor() { super('MenuScene'); }
  create() {
    console.log('MenuScene created');
    // nothing here now; menu is pure HTML
  }
}

class GameScene extends Phaser.Scene {
  constructor() { super('GameScene'); }

  init(data) {
    this.mapName = data.mapName || 'default-map';
    console.log('GameScene init, mapName =', this.mapName);
  }

  preload() {
    console.log('Preloading map:', this.mapName);
    this.load.json('mapData', `assets/maps/${this.mapName}.json`);
  }

  create() {
    console.log('Creating map from JSON…');
    const map = this.cache.json.get('mapData');
    const rows = map.rows, cols = map.cols;
    this.grid = [];

    for (let y = 0; y < rows; y++) {
      this.grid[y] = [];
      for (let x = 0; x < cols; x++) {
        // pick fill color by owner code
        let code = map.tiles[y][x];
        let fill = code === 1 ? 0x22aa22
                 : code === 2 ? 0xaa2222
                 : 0x444444;

        const rect = this.add
          .rectangle(
            x * TILE_SIZE + TILE_SIZE/2,
            y * TILE_SIZE + TILE_SIZE/2,
            TILE_SIZE - 2,
            TILE_SIZE - 2,
            fill
          )
          .setStrokeStyle(1, 0x888888);

        this.grid[y][x] = { owner: code, rect };
      }
    }

    // allow clicking neutral tiles to claim them
    this.input.on('pointerdown', ptr => {
      const gx = Math.floor(ptr.x / TILE_SIZE);
      const gy = Math.floor(ptr.y / TILE_SIZE);
      if (gx >= 0 && gx < cols && gy >= 0 && gy < rows) {
        let cell = this.grid[gy][gx];
        if (cell.owner === 0) {
          cell.owner = 1;
          cell.rect.fillColor = 0x22aa22;
        }
      }
    });
  }
}

// finally, launch the Phaser game
game = new Phaser.Game(config);
