class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  init() {

    this.scene.launch('Ui');
    this.uiScene=this.scene.get('Ui')
    this.aboveStuff=false
    this.inWater=false
    this.houseCoordsX=0
    this.houseCoordsY=0
    this.dragEnd=false
    this.homeX=this.uiScene.houseCoordsX
    this.homeY=this.uiScene.houseCoordsY
    this.house={}
    this.pointerCoordX=0
    this.pointerCoordY=0
    this.pointX=0
    this.pointY=0
    this.pickHouse=false
    this.pickFarm=false
    this.dragging=false
    this.buildFarm=false
    this.buildHouse=false
    // this.houseGroup=[]
  }

  create(player) {
    this.createMap();
    this.createAudio();
    this.createGroups();
    this.createInput();
    this.createGameManager();
    this.teleporter=this.physics.add.image(214, 296, 'items').setAlpha(0)
    this.teleporter2=this.physics.add.image(1469, 660, 'items').setAlpha(0)
    this.teleporter3=this.physics.add.image(3667, 146, 'items').setAlpha(0)

    this.homeicon = this.add.sprite(80, 80, 'home').setInteractive();
    this.input.setDraggable(this.homeicon);
    this.homeicon.setScale(0.1)
    this.input.dragDistanceThreshold = 8;

    this.farmicon = this.add.sprite(80, 80, 'farm').setInteractive();
    this.input.setDraggable(this.farmicon);
    this.farmicon.setScale(0.1)
    this.input.dragDistanceThreshold = 8;

    this.addCollisions();
  }




  update() {

if(this.buildFarm){
  let pointX=game.input.mousePointer.worldX
  let pointY=game.input.mousePointer.worldY
  this.farmGroup.create(pointX,pointY,'farm').setScale(0.5).refreshBody();
  this.buildFarm=false
}

if(this.buildHouse){
  let pointX=game.input.mousePointer.worldX
  let pointY=game.input.mousePointer.worldY
  this.houseGroup.create(pointX,pointY,'home').setScale(0.3).refreshBody();
  this.buildHouse=false
}


    if(this.dragging && this.pickFarm||this.dragging && this.pickHouse){
if(this.dragging && this.pickFarm){
  this.farmicon.x = game.input.mousePointer.worldX
  this.farmicon.y = game.input.mousePointer.worldY
}
if(this.dragging && this.pickHouse){
  this.homeicon.x = game.input.mousePointer.worldX
  this.homeicon.y = game.input.mousePointer.worldY
}}else{this.homeicon.setPosition((this.cameras.main.worldView.x+80),(this.cameras.main.worldView.y+80))
this.farmicon.setPosition((this.cameras.main.worldView.x+60),(this.cameras.main.worldView.y+140))}








    this.inWater=false
    if (this.player) {this.player.update(this.cursors);
    }

    if (this.player.aboveStuff==true){
      this.jumpableLayer1.active=false
      this.jumpableLayer2.active=false
    }
    else{this.jumpableLayer1.active=true
      this.jumpableLayer2.active=true
}}



  createAudio() {
    this.goldPickupAudio = this.sound.add('goldSound', { loop: false, volume: 0.3 });
    this.playerAttackAudio = this.sound.add('playerAttack', { loop: false, volume: 0.01 });
    this.playerDamageAudio = this.sound.add('playerDamage', { loop: false, volume: 0.2 });
    this.playerDeathAudio = this.sound.add('playerDeath', { loop: false, volume: 0.2 });
    this.monsterDeathAudio = this.sound.add('enemyDeath', { loop: false, volume: 0.2 });
  }



  createPlayer(playerObject) {

    this.player = new PlayerContainer(
      this,
      playerObject.x * 2,
      playerObject.y * 2,
      'hero',
      0,
      playerObject.health,
      playerObject.wood,
      playerObject.maxHealth,
      playerObject.id,
      this.playerAttackAudio,
      this.scene.aboveStuff,
    );

    this.player.setScale(0.5)
    this.anims.create({
      key:'walkdown',
      repeat:-1,
      frameRate:5,
      frames:this.anims.generateFrameNames('hero',{start:0,end:5})})

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
      frames:this.anims.generateFrameNames('hero',{start:1,end:1})})

      this.anims.create({
        key:'boatdown',
        repeat:-1,
        frameRate:5,
        frames:this.anims.generateFrameNames('boat',{start:0,end:0})})

      this.anims.create({
        key:'boatup',
        repeat:-1,
        frameRate:5,
        frames:this.anims.generateFrameNames('boat',{start:3,end:3})})

      this.anims.create({
        key:'boatleft',
        repeat:-1,
        frameRate:5,
        frames:this.anims.generateFrameNames('boat',{start:1,end:1})})

      this.anims.create({
        key:'boatright',
        repeat:-1,
        frameRate:5,
        frames:this.anims.generateFrameNames('boat',{start:2,end:2})})



  }



  createGroups() {
    // create a chest group
    this.chests = this.physics.add.group();
    // create a monster group
    this.monsters = this.physics.add.group();
    this.seeds = this.physics.add.group();

    this.woods=this.physics.add.group();
    // this.houses=this.physics.add.group();
    this.monsters.runChildUpdate = true;
    this.houseGroup=this.physics.add.staticGroup()
    this.farmGroup=this.physics.add.staticGroup()

  }

  spawnChest(chestObject) {
    console.log('chest object')
    console.log(chestObject)
    let chest = this.chests.getFirstDead();
    if (!chest) {
      let chest = new Chest(this, chestObject.x, chestObject.y, 'items', 0, chestObject.gold, chestObject.id);
      this.chests.add(chest);
    } else {
      chest.coins = chestObject.gold;
      chest.id = chestObject.id;
      chest.setPosition(chestObject.x, chestObject.y);
      chest.makeActive();
    }
  }


  spawnWood(woodObject) {
    let wood = this.woods.getFirstDead();

    if (!wood) {
      wood = new Wood(this, woodObject.x , woodObject.y, 'wood', 0, woodObject.wood, woodObject.id);
      // add chest to chests group
      this.woods.add(wood);
    } else {
      wood.wood = woodObject.wood;
      wood.id = woodObject.id;
      wood.setPosition(woodObject.x, woodObject.y);
      wood.makeActive();
    }
  }

  spawnSeeds(seedObject) {
    console.log('seed object')
    console.log(seedObject)
    let seed = this.seeds.getFirstDead();

    if (!seed) {
      var num=Math.floor(Math.random() * (7 - 0) + 0);

      seed = new Seeds(this, seedObject.x , seedObject.y, 'seeds', num, seedObject.seeds, seedObject.id);
      // add chest to chests group
      this.seeds.add(seed);
    } else {
      seed.seeds = seedObject.seeds;
      seed.id = seedObject.id;
      seed.setPosition(seedObject.x, seedObject.y);
      seed.makeActive();

    }
  }



  spawnMonster(monsterObject) {
    let monster = this.monsters.getFirstDead();
    if (!monster) {
      monster = new Monster(
        this,
        monsterObject.x,
        monsterObject.y,
        'monsters',
        monsterObject.frame,
        monsterObject.id,
        monsterObject.health,
        monsterObject.maxHealth,
      );
      // add monster to monsters group
      this.monsters.add(monster);
    } else {
      monster.id = monsterObject.id;
      monster.health = monsterObject.health;
      monster.maxHealth = monsterObject.maxHealth;
      monster.setTexture('monsters', monsterObject.frame);
      monster.setPosition(monsterObject.x, monsterObject.y);
      monster.makeActive();
    }
  }

  createInput() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  addCollisions() {
    // check for collisions between the player and the tiled blocked layer
    this.physics.add.collider(this.player, this.blockedLayer);
    // this.physics.add.collider(this.player, this.houses);
    this.physics.add.collider(this.player, this.houses)
    this.physics.add.collider(this.player, this.houseLayer)
    this.physics.add.collider(this.player, this.houseLayer2)
    this.physics.add.collider(this.player, this.houseLayer3)
    this.jumpableLayer1=this.physics.add.collider(this.player, this.jumpableLayer)
    this.physics.add.collider(this.player, this.caveBlockedLayer)
    this.jumpableLayer2=this.physics.add.collider(this.player, this.caveJumpableLayer)
    this.physics.add.collider(this.player, this.castleLayer)
    this.physics.add.collider(this.monsters, this.map.blockedLayer);
    this.physics.add.collider(this.player,this.houseGroup)
    this.physics.add.collider(this.player,this.farmGroup)



    this.physics.add.overlap(this.player, this.teleporter, this.goInsideHouse1, null, this)
    this.physics.add.overlap(this.player, this.seeds, this.collectSeeds, null, this)

    this.physics.add.overlap(this.player, this.teleporter2, this.goInsideCave, null, this)
    this.physics.add.overlap(this.player, this.teleporter3, this.goOutsideCave, null, this)
    this.physics.add.overlap(this.player, this.chests, this.collectChest, null, this);
    this.physics.add.overlap(this.player, this.woods, this.collectWood, null, this);
    this.physics.add.overlap(this.player, this.sea11, this.createShip, null, this)
    this.physics.add.overlap(this.player, this.sea12, this.createShip, null, this)
    this.physics.add.overlap(this.player, this.sea13, this.createShip, null, this)
    this.physics.add.overlap(this.player, this.sea21, this.createShip, null, this)
    this.physics.add.overlap(this.player, this.sea22, this.createShip, null, this)
    this.physics.add.overlap(this.player, this.sea23, this.createShip, null, this)
    this.physics.add.overlap(this.player, this.monsters, this.playerAttacked, null, this)
    // this.physics.add.overlap(this.player, this.monsters, this.playerAttacked);
    this.physics.add.overlap(this.player.weapon, this.monsters, this.enemyOverlap, null, this);
  }

 createShip(player){
  this.player.createShip()

   }



  playerAttacked(){
    console.log("player attacked")
    console.log(this.player)
    this.player.updateHealth(-0.0001)
    this.player.updateHealthBar()

  }




goInsideCave(){
this.player.setPosition(3670.1,200)
this.cameras.main.setBounds(2920, 0, this.map.widthInPixels, 1070);
}
goOutsideCave(){
this.player.setPosition(1470,720)
this.cameras.main.setBounds(0, 0, 2911, this.map.heightInPixels);
}

  enemyOverlap(weapon, enemy) {
    if (this.player.playerAttacking && !this.player.swordHit) {
      this.player.swordHit = true;
      this.events.emit('monsterAttacked', enemy.id, this.player.id);
    }
  }

  enemyOverlap(weapon, enemy) {
    if (this.player.playerAttacking && !this.player.swordHit) {
      this.player.swordHit = true;
      this.events.emit('monsterAttacked', enemy.id, this.player.id);
    }
  }

  collectChest(player, chest) {
    // play gold pickup sound
    console.log(player)
    console.log(chest)
    this.goldPickupAudio.play();
    this.events.emit('pickUpChest', chest.id, player.id);
  }

  collectWood(player, wood) {
    // play gold pickup sound
    console.log(player)
    console.log(wood)
    console.log(wood.id)
    this.goldPickupAudio.play();
    this.events.emit('pickUpWood', wood.id, player.id);
  }

  collectSeeds(player, seeds) {


    this.goldPickupAudio.play();
    this.events.emit('pickUpSeeds', seeds.id, player.id);
  }

  createMap() {

    this.map=this.make.tilemap({key:'map'})
    this.tiles=this.map.addTilesetImage('mountain_landscape','background',32,32,1,2)
  this.houses=this.map.addTilesetImage('house8','house3')
  this.houses2=this.map.addTilesetImage('house10','house1')
  this.houses3=this.map.addTilesetImage('house9','house4')
  this.caveTiles=this.map.addTilesetImage('house9','house4')
  this.castleTiles=this.map.addTilesetImage('Castle','castle')
  this.waterTiles=this.map.addTilesetImage('wood_tileset','water')


  this.backgroundLayer=this.map.createStaticLayer('background',this.tiles,0,0)
  this.jumpableLayer=this.map.createStaticLayer('Jumpable Layer',this.tiles,0,0)
  this.castleLayer=this.map.createStaticLayer('castle',this.castleTiles,0,0)

  this.blockedLayer=this.map.createStaticLayer('Blocked Layer',this.tiles,0,0)
  this.houseLayer2=this.map.createStaticLayer('House Layer 2',this.houses2,0,0)
  this.houseLayer3=this.map.createStaticLayer('House Layer 3',this.houses3,0,0)
  this.houseLayer=this.map.createStaticLayer('House Layer',this.houses,0,0)
  this.caveTiles=this.map.addTilesetImage('caveTilesheet','caveTilesheet',32,32,0,2)
  this.castleCoverLayer=this.map.createStaticLayer('Castle Cover Layer',this.castleTiles,0,0)

  this.caveBaseLayer=this.map.createStaticLayer('Cave Base Layer',this.caveTiles,0,0)
  this.caveJumpableLayer=this.map.createStaticLayer('Cave Jumpable Layer',this.caveTiles,0,0)
  this.caveBlockedLayer=this.map.createStaticLayer('Cave Blocked Layer',this.caveTiles,0,0)
  this.seaCover1=this.physics.add.image(2500, 2500,'sea').setScale(0.6)
  this.seaCover2=this.physics.add.image(2500, 800,'sea').setScale(0.6)
  this.sea11=this.physics.add.image(2220, 2680,'sea1').setScale(0.6).setAlpha(0)
  this.sea12=this.physics.add.image(2400, 2600,'sea2').setScale(0.6).setAlpha(0)
  this.sea13=this.physics.add.image(2650, 2530,'sea3').setScale(0.6).setAlpha(0)
  this.sea21=this.physics.add.image(2220, 980,'sea1').setScale(0.6).setAlpha(0)
  this.sea22=this.physics.add.image(2400, 900,'sea2').setScale(0.6).setAlpha(0)
  this.sea23=this.physics.add.image(2660, 820,'sea3').setScale(0.6).setAlpha(0)

  this.castleLayer.setCollisionByExclusion([-1]);

  this.caveBlockedLayer.setCollisionByExclusion([-1]);
  this.caveJumpableLayer.setCollisionByExclusion([-1]);
  this.houseLayer2.setCollisionByExclusion([-1]);
  this.houseLayer3.setCollisionByExclusion([-1]);
  this.jumpableLayer.setCollisionByExclusion([-1]);


  this.houseLayer.setCollisionByExclusion([-1]);
  this.blockedLayer.setCollisionByExclusion([-1]);





  //    // update the world bounds
  this.physics.world.bounds.width = this.map.widthInPixels;
  this.physics.world.bounds.height = this.map.heightInPixels;
  //
  //    // limit the camera to the size of our map
  this.cameras.main.setBounds(0, 0, 2911, this.map.heightInPixels);
}


  createGameManager() {
    this.events.on('spawnPlayer', (playerObject) => {

      this.HouseLayerCover=this.map.createStaticLayer('House Layer Cover',this.houses,0,0)
      this.createPlayer(playerObject);
      this.treeTops=this.map.createStaticLayer('TreeTops',this.tiles,0,0)
      this.HouseLayer2Cover=this.map.createStaticLayer('House Layer 2 Cover',this.houses2,0,0)
      this.HouseLayer3Cover=this.map.createStaticLayer('House Layer 3 Cover',this.houses3,0,0)
    });

this.input.on('pointerdown', function(){

console.log('pointer down')
  console.log(game.input.mousePointer.worldX)
console.log(game.input.mousePointer.worldY)})




    this.input.on('dragstart', function (pointer, gameObject) {

        gameObject.setScale(0.3).setAlpha(0.5)
console.log(gameObject.texture.key)
this.scene.dragging=true
if(gameObject.texture.key=='farm'){
  this.scene.pickFarm=true
}
if(gameObject.texture.key=='home'){
  this.scene.pickHouse=true
}


    });

    this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
console.log(this.scene.dragging)
console.log(this.scene.pickFarm)
    });

    this.input.on('dragend', function (pointer, gameObject) {
      this.scene.dragging=false
      gameObject.setScale(0.1).setPosition(80,80).setAlpha(1)
        this.scene.pointX=game.input.mousePointer.worldX
        this.scene.pointY=game.input.mousePointer.worldY

if(this.scene.pickFarm){

this.scene.events.emit('farmCreated', this.scene.player.id)

  this.scene.pickFarm=false
}
if(this.scene.pickHouse){
  this.scene.events.emit('houseCreated',this.scene.player.id)
  this.scene.pickHouse=false
}


    });






    this.events.on('chestSpawned', (chest) => {
      this.spawnChest(chest);
    });


    this.events.on('woodSpawned', (wood) => {
      this.spawnWood(wood);
    });

    this.events.on('seedsSpawned', (seeds) => {
      this.spawnSeeds(seeds);
    });

    this.events.on('farmCreatedReply', (player) => {
      if(player.seeds>=100){
      player.seeds-=100;
      this.events.emit('updateSeeds', player.seeds);

      this.buildFarm=true


    }
    });
    this.events.on('houseCreatedReply', (player) => {
      if (player.wood>=100){
      player.wood-=100;
      this.events.emit('updateWood', player.wood);
      this.buildHouse=true

    }});



    this.events.on('monsterSpawned', (monster) => {
      this.spawnMonster(monster);
    });

    this.events.on('chestRemoved', (chestId) => {
      this.chests.getChildren().forEach((chest) => {
        if (chest.id === chestId) {
          chest.makeInactive();
        }
      });
    });
    this.events.on('woodRemoved', (woodId) => {
      this.woods.getChildren().forEach((wood) => {
        if (wood.id === woodId) {
          wood.makeInactive();
        }
      });
    });

    this.events.on('seedsRemoved', (seedsId) => {
      this.seeds.getChildren().forEach((seeds) => {
        if (seeds.id === seedsId) {
          seeds.makeInactive();
        }
      });
    });

    this.events.on('monsterRemoved', (monsterId) => {
      this.monsters.getChildren().forEach((monster) => {
        if (monster.id === monsterId) {
          monster.makeInactive();
          this.monsterDeathAudio.play();
        }
      });
    });

    this.events.on('updateMonsterHealth', (monsterId, health) => {
      this.monsters.getChildren().forEach((monster) => {
        if (monster.id === monsterId) {
          monster.updateHealth(health);
        }
      });
    });

    this.events.on('monsterMovement', (monsters) => {
      this.monsters.getChildren().forEach((monster) => {
        Object.keys(monsters).forEach((monsterId) => {
          if (monster.id === monsterId) {
            this.physics.moveToObject(monster, monsters[monsterId], 40);
          }
        });
      });
    });

    this.events.on('updatePlayerHealth', (playerId, health) => {
      if (health < this.player.health) {
        this.playerDamageAudio.play();
      }
      this.player.updateHealth(health);
    });

    this.events.on('respawnPlayer', (playerObject) => {
      this.playerDeathAudio.play();
      this.player.respawn(playerObject);
    });

    this.gameManager = new GameManager(this, this.map.objects);
        console.log("this dot map dot objects")
    console.log(this.map.objects)
    this.gameManager.setup();
  }
}
