class GameManager {
  constructor(scene, mapData) {
    this.scene = scene;
    this.mapData = mapData;

    this.spawners = {};
    this.chests = {};
    this.monsters = {};
    this.players = {};
    this.woods={};
    this.houses={};
    this.seeds={}
    this.playerLocations = [];
    this.chestLocations = {};
    this.monsterLocations = {};
    this.seedsLocations = {};
    this.woodLocations = {};
  }

  setup() {
    this.parseMapData();
    console.log('object locations')
    console.log(this.chestLocations)
    console.log(this.seedsLocations)
    console.log(this.woodLocations)
    console.log(this.monsterLocations)


    this.setupEventListener();
    this.setupSpawners();
    this.spawnPlayer();

  }

  parseMapData() {
    this.mapData.forEach((layer) => {
      if (layer.name === 'player') {
        layer.objects.forEach((obj) => {
          this.playerLocations.push([obj.x, obj.y]);
        });
      } else if (layer.name === 'chests') {
        layer.objects.forEach((obj) => {
          if (this.chestLocations[obj.properties.spawner]) {
            this.chestLocations[obj.properties.spawner].push([obj.x, obj.y]);
          } else {
            this.chestLocations[obj.properties.spawner] = [[obj.x, obj.y]];

          }
        });
      } else if (layer.name === 'monsters') {
        layer.objects.forEach((obj) => {
          if (this.monsterLocations[obj.properties.spawner]) {
            this.monsterLocations[obj.properties.spawner].push([obj.x, obj.y]);

          } else {
            this.monsterLocations[obj.properties.spawner] = [[obj.x, obj.y]];

          }
        });
      }   else if (layer.name === 'wood') {
        console.log("layer")
        console.log(layer)
          layer.objects.forEach((obj) => {
            if (this.woodLocations[obj.properties.spawner]) {
              this.woodLocations[obj.properties.spawner].push([obj.x, obj.y]);

            } else {
              this.woodLocations[obj.properties.spawner] = [[obj.x, obj.y]];

            }
          });
        }
    else if (layer.name === 'seeds') {
        console.log("layer")
      console.log(layer)
              layer.objects.forEach((obj) => {

                if (this.seedsLocations[obj.properties.spawner]) {
                  this.seedsLocations[obj.properties.spawner].push([obj.x, obj.y]);
                  console.log(this.seedsLocations)

                } else {
                  this.seedsLocations[obj.properties.spawner] = [[obj.x, obj.y]];


                }
              });
            }


    });
  }

  setupEventListener() {
    this.scene.events.on('houseCreated',(playerId)=>{
      this.scene.events.emit('houseCreatedReply', this.players[playerId])


    })
    this.scene.events.on('farmCreated',(playerId)=>{


      this.scene.events.emit('farmCreatedReply', this.players[playerId])
    })


    this.scene.events.on('pickUpChest', (chestId, playerId) => {
      // update the spawner
      if (this.chests[chestId]) {
        const { gold } = this.chests[chestId];

        // updating the players gold
        this.players[playerId].updateGold(gold);
        this.scene.events.emit('updateScore', this.players[playerId].gold);

        // removing the chest
        this.spawners[this.chests[chestId].spawnerId].removeObject(chestId);
        this.scene.events.emit('chestRemoved', chestId);
      }
    });

    this.scene.events.on('pickUpSeeds', (seedsId, playerId) => {

console.log('seeds')
      console.log(seedsId)
      console.log(this.seeds.length)
      console.log(this.seeds[seedsId])

      // update the spawner
      if (this.seeds[seedsId]) {
        const { seeds } = this.seeds[seedsId];

        console.log('seeds')

        // updating the players gold
        this.players[playerId].updateSeeds(seeds);
        this.scene.events.emit('updateSeeds', this.players[playerId].seeds);

        // removing the chest
        this.spawners[this.seeds[seedsId].spawnerId].removeObject(seedsId);
        this.scene.events.emit('seedsRemoved', seedsId);
      }
    });



    this.scene.events.on('pickUpWood', (woodId, playerId) => {
      console.log('woods')
      console.log(this.woods[woodId])
      console.log(this.woods)
      console.log(this.woods.length)

      // update the spawner
      if (this.woods[woodId]) {
        const { wood } = this.woods[woodId];
        console.log(wood)
        // updating the players gold
        this.players[playerId].updateWood(wood);


        console.log(this.players[playerId].wood)
        this.scene.events.emit('updateWood', this.players[playerId].wood);

        // removing the chest
        this.spawners[this.woods[woodId].spawnerId].removeObject(woodId);
        this.scene.events.emit('woodRemoved', woodId);
      }
    });




    this.scene.events.on('monsterAttacked', (monsterId, playerId) => {
      // update the spawner
      if (this.monsters[monsterId]) {
        const { gold, attack } = this.monsters[monsterId];

        // subtract health monster model
        this.monsters[monsterId].loseHealth();

        // check the monsters health, and if dead remove that object
        if (this.monsters[monsterId].health <= 0) {
          // updating the players gold
          this.players[playerId].updateGold(gold);
          this.scene.events.emit('updateScore', this.players[playerId].gold);

          // removing the monster
          this.spawners[this.monsters[monsterId].spawnerId].removeObject(monsterId);
          this.scene.events.emit('monsterRemoved', monsterId);

          // add bonus health to the player
          this.players[playerId].updateHealth(2);
          this.scene.events.emit('updatePlayerHealth', playerId, this.players[playerId].health);
        } else {
          // update the players health
          this.players[playerId].updateHealth(-attack);
          this.scene.events.emit('updatePlayerHealth', playerId, this.players[playerId].health);

          // update the monsters health
          this.scene.events.emit('updateMonsterHealth', monsterId, this.monsters[monsterId].health);

          // check the player's health, if below 0 have the player respawn
          if (this.players[playerId].health <= 0) {
            // update the gold the player has
            this.players[playerId].updateGold(parseInt(-this.players[playerId].gold / 2), 10);
            this.scene.events.emit('updateScore', this.players[playerId].gold);

            // respawn the player
            this.players[playerId].respawn();
            this.scene.events.emit('respawnPlayer', this.players[playerId]);
          }
        }
      }
    });
  }

  setupSpawners() {
    const config = {
      spawnInterval: 3000,
      limit: 5,
      spawnerType: SpawnerType.CHEST,
      id: '',
    };
    let spawner;

    // create chest spawners
    Object.keys(this.chestLocations).forEach((key) => {
      console.log('chest locations')
      console.log(this.chestLocations)
      config.id = `chest-${key}`;

      spawner = new Spawner(
        config,
        this.chestLocations[key],
        this.addChest.bind(this),
        this.deleteChest.bind(this)
      );
      this.spawners[spawner.id] = spawner;
    });

    // create monster spawners
    Object.keys(this.monsterLocations).forEach((key) => {
      config.id = `monster-${key}`;
      config.spawnerType = SpawnerType.MONSTER;

      // console.log(this.monsterLocations)
      spawner = new Spawner(
        config,
        this.monsterLocations[key],
        this.addMonster.bind(this),
        this.deleteMonster.bind(this),
        this.moveMonsters.bind(this),
      );
      this.spawners[spawner.id] = spawner;
    });

    Object.keys(this.woodLocations).forEach((key) => {
      console.log('wood key')
      console.log(key)
      config.id = `wood-${key}`;
      config.spawnerType = SpawnerType.WOOD;

      spawner = new Spawner(
        config,
        this.woodLocations[key],
        this.addWood.bind(this),
        this.deleteWood.bind(this),
      );
      this.spawners[spawner.id] = spawner;
    });
    Object.keys(this.seedsLocations).forEach((key) => {

      config.id = `seeds-${key}`;
      config.spawnerType = SpawnerType.SEEDS;

      spawner = new Spawner(
        config,
        this.seedsLocations[key],
        this.addSeeds.bind(this),
        this.deleteSeeds.bind(this),

      );
      this.spawners[spawner.id] = spawner;
    });
  }

  spawnPlayer() {
    const player = new PlayerModel(this.playerLocations);
    this.players[player.id] = player;
    this.scene.events.emit('spawnPlayer', player);
  }

  addChest(chestId, chest) {
    this.chests[chestId] = chest;
    this.scene.events.emit('chestSpawned', chest);
  }

  deleteChest(chestId) {
    delete this.chests[chestId];
  }

  addSeeds(seedsId, seeds) {
    this.seeds[seedsId] = seeds;
    this.scene.events.emit('seedsSpawned', seeds);
  }

  deleteSeeds(seedsId) {
    delete this.seeds[seedsId];
  }

  addWood(woodId, wood) {
    this.woods[woodId] = wood;
    this.scene.events.emit('woodSpawned', wood);
  }

  addHouse(houseId, house) {
    this.houses[houseId] = house;
    this.scene.events.emit('houseSpawned', house);
  }

  deleteWood(woodId) {
    delete this.woods[woodId];
  }

  deleteHouse(houseId) {
    delete this.houses[houseId];
  }

  addMonster(monsterId, monster) {
    this.monsters[monsterId] = monster;
    this.scene.events.emit('monsterSpawned', monster);
  }

  deleteMonster(monsterId) {
    delete this.monsters[monsterId];
  }

  moveMonsters() {
    this.scene.events.emit('monsterMovement', this.monsters);
  }
}
