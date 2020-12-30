class HouseScene1 extends Phaser.Scene {
  constructor() {
    super('HouseScene1');
  }

  init() {

    // grab a reference to the game scene
    this.gameScene = this.scene.get('Game');
    this.scene.launch('Ui');

  }


  create(data) {
    this.createMap();
    this.createPlayer(data);
    this.createAudio();
    this.createInput();
    console.log(this.scene)
    this.input.on('pointerdown', function(){console.log( game.input.mousePointer.worldX)
    console.log(game.input.mousePointer.worldY)})
    this.teleporter1=this.physics.add.image(222, 410,'items').setAlpha(0)
    this.addCollisions();
  }

  update() {
    if (this.player) {this.player.update(this.cursors);}

  }

  createAudio() {
    this.goldPickupAudio = this.sound.add('goldSound', { loop: false, volume: 0.3 });
    this.playerAttackAudio = this.sound.add('playerAttack', { loop: false, volume: 0.01 });
    this.playerDamageAudio = this.sound.add('playerDamage', { loop: false, volume: 0.2 });
    this.playerDeathAudio = this.sound.add('playerDeath', { loop: false, volume: 0.2 });
    this.monsterDeathAudio = this.sound.add('enemyDeath', { loop: false, volume: 0.2 });
  }

  createInput() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }


createPlayer(playerObject){
  this.player = new PlayerContainer(
    this,
    224,
    370,
    'hero',
    0,
    playerObject.health,
    playerObject.wood,
    playerObject.maxHealth,
    playerObject.id,
    this.playerAttackAudio,
  );

  this.player.setScale(0.5)
  this.anims.create({
    key:'walkdown',
    repeat:-1,
    frameRate:5,
    frames:this.anims.generateFrameNames('hero',{start:0,end:6})})

  this.anims.create({
    key:'walkup',
    repeat:-1,
    frameRate:5,
    frames:this.anims.generateFrameNames('hero',{start:39,end:41})})

  this.anims.create({
    key:'walkleft',
    repeat:-1,
    frameRate:5,
    frames:this.anims.generateFrameNames('hero',{start:12,end:17})})

  this.anims.create({
    key:'walkright',
    repeat:-1,
    frameRate:5,
    frames:this.anims.generateFrameNames('hero',{start:24,end:29})})

  this.anims.create({
    key:'idle',
    repeat:-1,
    frameRate:5,
    frames:this.anims.generateFrameNames('hero',{start:6,end:6})})

}

  addCollisions() {
    this.physics.add.collider(this.player, this.blockedLayer);
    this.physics.add.overlap(this.player, this.teleporter1, this.goOutside, null, this)

}


goOutside(){
  this.scene.stop();
  this.gameScene.scene.wake()

}

  createMap() {
  this.map=this.make.tilemap({key:'interiormap'})
  this.tiles=this.map.addTilesetImage('interior','interior')
  this.backgroundLayer=this.map.createStaticLayer('Tile Layer 1',this.tiles,0,0)
  this.blockedLayer=this.map.createStaticLayer('Inside Blocked Layer',this.tiles,0,0)
  this.blockedLayer.setCollisionByExclusion([-1])


  //    // update the world bounds
  this.physics.world.bounds.width = this.map.widthInPixels;
  this.physics.world.bounds.height = this.map.heightInPixels;
  //
  //    // limit the camera to the size of our map
  this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
}




}
