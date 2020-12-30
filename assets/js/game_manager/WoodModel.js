class WoodModel {
  constructor(x, y, wood, spawnerId) {
    this.id = `${spawnerId}-${uuid.v4()}`;
    this.spawnerId = spawnerId;
    this.x = x;
    this.y = y;
    this.wood = wood;
  }
}
