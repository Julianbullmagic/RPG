class Wood extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, key, frame, wood, id) {
    super(scene, x, y, key, frame);
    this.scene = scene; // the scene this game object will be added to
    this.wood = wood; // the amount of coins this chest contains
    this.id = id;

    // enable physics
    this.scene.physics.world.enable(this);
    // add the player to our existing scene
    this.scene.add.existing(this);
    // scale the chest game object
    this.setScale(0.2);
  }

  makeActive() {
    this.setActive(true);
    this.setVisible(true);
    this.body.checkCollision.none = false;
  }

  makeInactive() {
    this.setActive(false);
    this.setVisible(false);
    this.body.checkCollision.none = true;
  }
}
