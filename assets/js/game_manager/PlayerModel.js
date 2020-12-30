class PlayerModel {
  constructor(spawnLocations) {
    this.health = 10;
    this.wood=0;
    this.maxHealth = 10;
    this.gold = 0;
    this.seeds = 0;
    this.id = `player-${uuid.v4()}`;
    this.spawnLocations = spawnLocations;

    const location = this.spawnLocations[Math.floor(Math.random() * this.spawnLocations.length)];
    [this.x, this.y] = location;
  }

  updateGold(gold) {
    this.gold += gold;
  }

  updateWood(wood) {
    this.wood += wood;
  }
  updateSeeds(seeds) {
    this.seeds += seeds;
  }

  updateHealth(health) {
    this.health += health;
    if (this.health > 10) this.health = 10;
  }

  respawn() {
    this.health = this.maxHealth;
    const location = this.spawnLocations[Math.floor(Math.random() * this.spawnLocations.length)];
    [this.x, this.y] = location;
  }
}
