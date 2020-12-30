class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, key, frame) {
    super(scene, x, y, key, frame);
    this.scene = scene; // the scene this container will be added to

    // enable physics
    this.scene.physics.world.enable(this);
    // set immovable if another object collides with our player
    // scale our player

    // add the player to our existing scene
    this.scene.add.existing(this);
  }
}
