const Direction = {
  RIGHT: 'RIGHT',
  LEFT: 'LEFT',
  UP: 'UP',
  DOWN: 'DOWN',
};

class PlayerContainer extends Phaser.GameObjects.Container {
  constructor(scene, x, y, key, frame, health,wood, maxHealth, id, attackAudio, aboveStuff) {
    super(scene, x, y);
    this.scene = scene; // the scene this container will be added to
    this.velocity = 160; // the velocity when moving our player
    this.currentDirection = Direction.RIGHT;
    this.playerAttacking = false;
    this.flipX = true;
    this.swordHit = false;
    this.health = health;
    this.wood=wood;
    this.maxHealth = maxHealth;
    this.id = id;
    this.inWater=false;
    this.attackAudio = attackAudio;
    this.aboveStuff=aboveStuff;
    this.jumping=0
    this.falling=0
    this.hitPeek=false
    this.aboveStuff=false
    this.onGround=true
    // set a size on the container
    this.setSize(39, 54);
    // enable physics

    this.scene.physics.world.enable(this);
    // collide with world bounds
    this.body.setCollideWorldBounds(true);
    // add the player container to our existing scene
    this.scene.add.existing(this);
    // have the camera follow the player
    this.scene.cameras.main.startFollow(this);




    // create the player


    // create the weapon game object
    this.weapon = this.scene.add.image(40, 0, 'items', 4);
    this.shadow = this.scene.add.image(0, 5, 'hero', 6);
    this.player = new Player(this.scene, 0, 0, key, frame);
    this.add(this.player);
    this.scene.add.existing(this.shadow);
    this.scene.physics.world.enable(this.shadow);
    this.add(this.shadow);
    this.scene.add.existing(this.weapon);
    this.weapon.setScale(1.5);
    this.scene.physics.world.enable(this.weapon);
    this.add(this.weapon);
    this.weapon.alpha = 0;
    this.boatVanish=0
    this.inWater=false
    this.boat = this.scene.add.sprite(0, 0, 'boat',0).setAlpha(0);
    this.boat.setPosition(0,-60)
    this.scene.add.existing(this.boat);
    this.boat.setScale(1.5)
    this.scene.physics.world.enable(this.boat);
    this.add(this.boat);
    // create the player healthbar
    this.createHealthBar();
  }



  createShip(){
    console.log("ship about to be created")
    this.boatVanish=0
    this.boat.setAlpha(1)
    this.player.setAlpha(0)


  }

  createHealthBar() {
    this.healthBar = this.scene.add.graphics();
    this.updateHealthBar();
  }

  updateHealthBar() {
    this.healthBar.clear();
    this.healthBar.fillStyle(0xffffff, 1);
    this.healthBar.fillRect(this.x - 32, this.y - 40, 64, 5);
    this.healthBar.fillGradientStyle(0xff0000, 0xffffff, 4);
    this.healthBar.fillRect(this.x - 32, this.y - 40, 64 * (this.health / this.maxHealth), 5);
  }

  updateHealth(health) {
    this.health = health;
    this.updateHealthBar();
  }

  respawn(playerObject) {
    this.health = playerObject.health;
    this.setPosition(playerObject.x, playerObject.y);
    this.updateHealthBar();
  }





  update(cursors) {
    this.body.setVelocity(0)
    this.player.setVelocity(0)


      this.boatVanish+=1

if (this.boatVanish%10==0){
  this.boat.setAlpha(0)
  this.player.setAlpha(1)
}

if(this.boatVanish==100){
  this.boatVanish=0
}

  if (this.player.y>=0){
    this.player.setPosition(0)
    this.player.setVelocityY(0)

  }

if (this.jumping>=60){
  this.hitPeek==true
}

if(this.player.y<=0){
    this.player.setVelocityY(0)

}

if(this.player.y<=-10){
this.aboveStuff=true
}else{this.aboveStuff=false
}
      if(cursors.shift.isDown){
        if(this.jumping<60 && this.hitPeek==false){
          this.player.setVelocityY(-200)
          this.jumping+=2
        }
        else{
          if(this.jumping>0){
          this.player.setVelocityY(200)

        } else{
          this.player.setVelocityY(0)
          }
      }
    }else{
      if(this.jumping>0){
      this.player.setVelocityY(200)
      this.jumping-=2

    } else{
      this.player.setVelocityY(0)

    }
  }






if(cursors.left.isDown||cursors.right.isDown||cursors.down.isDown||cursors.up.isDown){
    if (cursors.left.isDown) {
      this.body.setVelocityX(-this.velocity);
      this.currentDirection = Direction.LEFT;
      this.player.play('walkleft',true)
      this.boat.play('boatleft',true)
      this.weapon.setPosition(-40, 0);
      this.player.flipX = false;
    } else if (cursors.right.isDown) {
      this.body.setVelocityX(this.velocity);
      this.currentDirection = Direction.RIGHT;
      this.weapon.setPosition(40, 0);
      this.player.play('walkleft',true)
      this.boat.play('boatright',true)

      this.player.flipX = true;
    }

    if (cursors.up.isDown) {
      this.body.setVelocityY(-this.velocity);
      this.currentDirection = Direction.UP;
      this.player.play('walkup',true)
      this.boat.play('boatup',true)

      this.weapon.setPosition(0, -40);
    } else if (cursors.down.isDown) {
      this.body.setVelocityY(this.velocity);
      this.currentDirection = Direction.DOWN;
      this.player.play('walkdown',true)
      this.boat.play('boatdown',true)

      this.weapon.setPosition(0, 40);
    }}else this.player.play('idle',true)

    if (Phaser.Input.Keyboard.JustDown(cursors.space) && !this.playerAttacking) {
      this.weapon.alpha = 1;
      this.playerAttacking = true;
      // this.attackAudio.play();
      this.scene.time.delayedCall(150, () => {
        this.weapon.alpha = 0;
        this.playerAttacking = false;
        this.swordHit = false;
      }, [], this);
    }

    if (this.playerAttacking) {
      if (this.weapon.flipX) {
        this.weapon.angle -= 10;
      } else {
        this.weapon.angle += 10;
      }
    } else {
      if (this.currentDirection === Direction.DOWN) {
        this.weapon.setAngle(-270);
      } else if (this.currentDirection === Direction.UP) {
        this.weapon.setAngle(-90);
      } else {
        this.weapon.setAngle(0);
      }

      this.weapon.flipX = false;
      if (this.currentDirection === Direction.LEFT) {
        this.weapon.flipX = true;
      }
    }

    this.updateHealthBar();
  }
}
