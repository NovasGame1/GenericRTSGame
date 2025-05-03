let game;

window.addEventListener('DOMContentLoaded', () => {
  // menu buttons
  document.getElementById('singleplayer-btn')
    .addEventListener('click', () => {
      document.getElementById('menu').style.display = 'none';
      // tell the GameScene which map image to use:
      game.scene.start('GameScene', { mapKey: 'default-map' });
    });
  document.getElementById('multiplayer-btn')
    .addEventListener('click', () => alert('Multiplayer coming soon!'));
  document.getElementById('settings-btn')
    .addEventListener('click', () => alert('Settings coming soon!'));
});

const TILE_SIZE = 64;
const DEFAULT_ROWS = 8, DEFAULT_COLS = 12;

const config = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: TILE_SIZE * DEFAULT_COLS,
  height: TILE_SIZE * DEFAULT_ROWS,
  backgroundColor: '#222',
  scene: [ MenuScene, GameScene ]
};

class MenuScene extends Phaser.Scene {
  constructor(){ super('MenuScene'); }
  create(){
    // nothing here—menu is pure HTML
  }
}

class GameScene extends Phaser.Scene {
  constructor(){ super('GameScene'); }

  init(data) {
    this.mapKey = data.mapKey || 'default-map';
    console.log('Loading map image:', this.mapKey);
  }

  preload() {
    // load the chosen map image from assets/maps/<mapKey>.png
    this.load.image('mapImage', `assets/maps/${this.mapKey}.png`);
  }

  create() {
    // draw the map full-screen (0,0) origin
    this.add.image(0, 0, 'mapImage')
      .setOrigin(0, 0)
      // scale to fit if needed:
      .setDisplaySize(this.sys.game.config.width, this.sys.game.config.height);

    // OPTIONAL: overlay your grid on top for clicking
    this.grid = [];
    for (let y = 0; y < DEFAULT_ROWS; y++) {
      this.grid[y] = [];
      for (let x = 0; x < DEFAULT_COLS; x++) {
        const rect = this.add.rectangle(
          x * TILE_SIZE + TILE_SIZE/2,
          y * TILE_SIZE + TILE_SIZE/2,
          TILE_SIZE - 2, TILE_SIZE - 2,
          0x000000,      // fully transparent fill
          0               // alpha = 0
        ).setStrokeStyle(1, 0x888888)
         .setInteractive();
        this.grid[y][x] = { rect, claimed:false };
      }
    }

    // clicking a cell toggles a semi-transparent highlight
    this.input.on('gameobjectdown', (pointer, gameObject) => {
      for (let y = 0; y < DEFAULT_ROWS; y++) {
        for (let x = 0; x < DEFAULT_COLS; x++) {
          if (this.grid[y][x].rect === gameObject) {
            const cell = this.grid[y][x];
            cell.claimed = !cell.claimed;
            cell.rect.fillColor = cell.claimed ? 0x22aa22 : 0x000000;
            cell.rect.fillAlpha = cell.claimed ? 0.4 : 0;
          }
        }
      }
    });
  }
}

game = new Phaser.Game(config);
