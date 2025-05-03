let game;

window.addEventListener('DOMContentLoaded', () => {
  document
    .getElementById('singleplayer-btn')
    .addEventListener('click', () => {
      document.getElementById('menu').style.display = 'none';
      game.scene.start('GameScene', { mapName: 'default-map' });
    });
  document
    .getElementById('multiplayer-btn')
    .addEventListener('click', () => alert('Multiplayer coming soon!'));
  document
    .getElementById('settings-btn')
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
  create(){ /* menu is plain HTML */ }
}

class GameScene extends Phaser.Scene {
  constructor(){ super('GameScene'); }
  init(data) {
    this.mapName = data.mapName || 'default-map';
  }

  preload() {
    // load the map image instead of JSON
    const key = 'mapImage';
    const url = `assets/maps/${this.mapName}.png`;
    console.log('Loading map image from', url);
    this.load.image(key, url);

    this.load.on('filecomplete-image-mapImage', () => {
      console.log('✅ Map image loaded');
    });
    this.load.on('loaderror', file => {
      if (file.type === 'image') {
        console.error('❌ Failed to load map image:', file.src);
      }
    });
  }

  create() {
    // draw the full‐screen map image
    const img = this.add.image(0, 0, 'mapImage')
      .setOrigin(0, 0)
      .setDisplaySize(this.scale.width, this.scale.height);

    // OPTIONAL: if you still want a clickable grid overlay, you can now
    //   loop your tiles exactly as before, but behind or on top of this image.
    // For now, we’ll just stop here so you see the map.
  }
}

game = new Phaser.Game(config);
