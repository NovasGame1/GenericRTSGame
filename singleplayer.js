// … inside create(), after you draw the background image …

for (let y = 0; y < rows; y++) {
  this.grid[y] = [];
  for (let x = 0; x < cols; x++) {
    // start with no fill (alpha=0), no stroke
    const rect = this.add.rectangle(
      x * TILE_SIZE + TILE_SIZE/2,
      y * TILE_SIZE + TILE_SIZE/2,
      TILE_SIZE - 2,
      TILE_SIZE - 2,
      0x000000,
      0         // fully transparent
    )
    .setInteractive();  // still catch clicks

    this.grid[y][x] = { owner: map.tiles[y][x], rect };

    rect.on('pointerdown', () => {
      const cell = this.grid[y][x];
      if (cell.owner === 1) {
        // unclaim
        cell.owner = 0;
        rect.setFillStyle(0x000000, 0);
      } else {
        // claim
        cell.owner = 1;
        rect.setFillStyle(0x22aa22, 0.5);  // green, half-transparent
      }
    });
  }
}
