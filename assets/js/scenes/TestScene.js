class TestScene extends Phaser.Scene {
  constructor() {
    super('Test');
  }

  create() {
      this.physics.world.bounds.width = 1000;
    this.physics.world.bounds.height = 1000;
      
    this.monster = new Monster(this,
        900,
        900,
        'monsters',
        0,
        0,
        10,
        10);
      this.physics.moveTo(this.monster, 2000, 2000);
  }
    
    update() {
        console.log(this.monster.x);
        console.log(this.monster.y);
    }
}
