class UiScene extends Phaser.Scene {
  constructor() {
    super('Ui');
  }

  init() {
    // grab a reference to the game scene
    this.gameScene = this.scene.get('Game');
    this.makeHouse=false
    this.houseCoordsX=0
    this.houseCoordsY=0
    this.scrollFactor=0
    this.dragEnd=false
  }

  create() {
    this.setupUiElements();
    this.setupEvents();



  }



  setupUiElements() {
    // create the score text game object
    this.scoreText = this.add.text(35, 8, 'Coins: 0', { fontSize: '16px', fill: '#fff' });
    this.woodText = this.add.text(35, 24, 'Wood: 0', { fontSize: '16px', fill: '#fff' });
    this.seedsText = this.add.text(35, 40, 'Seeds: 0', { fontSize: '16px', fill: '#fff' });

  }

  setupEvents() {
    // listen for the updateScore event from the game scene
    this.gameScene.events.on('updateScore', (score) => {
      this.scoreText.setText(`Coins: ${score}`);
    });
    this.gameScene.events.on('updateWood', (wood) => {
      this.woodText.setText(`Wood: ${wood}`);
    });
    this.gameScene.events.on('updateSeeds', (seeds) => {
      this.seedsText.setText(`Seeds: ${seeds}`);
    });
  }
}
