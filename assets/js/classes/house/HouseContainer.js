class HouseContainer extends Phaser.GameObjects.Container {
  constructor(scene, x, y, key) {
    super(scene, x, y);
    this.scene = scene; // the scene this container will be added to


    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);

    this.house = new House(this.scene, 0, 0, key,0);
    this.add(this.house);
    this.scene.add.existing(this.house);
    this.scene.physics.world.enable(this.house);

  }
}
