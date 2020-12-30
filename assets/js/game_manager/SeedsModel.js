class SeedsModel {
  constructor(x, y, seeds, spawnerId) {
    this.id = `${spawnerId}-${uuid.v4()}`;
    this.spawnerId = spawnerId;
    this.x = x;
    this.y = y;
    this.seeds = seeds;
  }
}
