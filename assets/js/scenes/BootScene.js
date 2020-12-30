class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  preload() {
    // load images
    this.loadImages();
    // load spritesheets
    this.loadSpriteSheets();
    // load audio
    this.loadAudio();
    // load tilemap
    this.loadTileMap();
  }

  loadImages() {
    this.load.image('button1', 'assets/images/ui/blue_button01.png');
    this.load.image('button2', 'assets/images/ui/blue_button02.png');
    // load the map tileset image
    this.load.image('background', 'assets/level/mountain_landscape_extruded.png');
    this.load.image('interior', 'assets/images/interior_extruded.png');
    this.load.image('caveTilesheet', 'assets/images/caveTilesheet_extruded.png');
    this.load.image('house1', 'assets/images/house10.png');
    this.load.image('house2', 'assets/images/house6.png');
    this.load.image('house3', 'assets/images/house8.png');
    this.load.image('house4', 'assets/images/house9.png');
    this.load.image('home','assets/images/house4.png')
    this.load.image('farm','assets/images/farm.png')
    this.load.image('fantasy', 'assets/images/fantasy.jpg');
    this.load.image('castle', 'assets/images/Castle.png');
    this.load.image('water', 'assets/images/wood_tileset.png');
    this.load.image('sea', 'assets/images/sea.png');
    this.load.image('sea1', 'assets/images/sea1.png');
    this.load.image('sea2', 'assets/images/sea2.png');
    this.load.image('sea3', 'assets/images/sea3.png');

  }

  loadSpriteSheets() {
    this.load.spritesheet('items', 'assets/images/items.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('boat', 'assets/images/boat.png', { frameWidth: 190, frameHeight: 210 });
    this.load.spritesheet('seeds', 'assets/images/seeds.png', { frameWidth: 74, frameHeight: 110 });
    this.load.spritesheet('characters', 'assets/images/characters.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('monsters', 'assets/images/monsters.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('hero', 'assets/images/hero.png', { frameWidth: 78, frameHeight: 108 });
    this.load.spritesheet('wood', 'assets/images/logs.png', { frameWidth: 372, frameHeight: 242 });

  }

  loadAudio() {
    this.load.audio('goldSound', ['assets/audio/Pickup.wav']);
    this.load.audio('enemyDeath', ['assets/audio/EnemyDeath.wav']);
    this.load.audio('playerAttack', ['assets/audio/PlayerAttack.wav']);
    this.load.audio('playerDamage', ['assets/audio/PlayerDamage.wav']);
    this.load.audio('playerDeath', ['assets/audio/PlayerDeath.wav']);
  }

  loadTileMap() {
    // map made with Tiled in JSON format
    this.load.tilemapTiledJSON('map', 'assets/level/level.json');
    this.load.tilemapTiledJSON('interiormap','assets/level/InsideHouse.json')
    this.load.tilemapTiledJSON('cavemap','assets/level/cave.json')

  }

  create() {
    this.scene.start('Title');
  }
}
