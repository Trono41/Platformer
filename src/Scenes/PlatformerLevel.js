class PlatformerLevel extends Phaser.Scene {
    constructor() {
        super("platformerLevelScene");
    }


    init() {
        // Initialize and set main variables
        this.ACCELERATION = 200;
        this.DRAG = 500;
        this.physics.world.gravity.y = 1500;
        this.JUMP_VELOCITY = -500;
        this.PARTICLE_VELOCITY = 50;
        this.SCALE = 2.2;
        this.gameEnd = false;
        this.soundCue = 25;
        this.soundDelay = 100;
        this.score = 0;
        this.gameEndMessage = "You beat the level!\nPress R to reset";
        this.displayGameEndMessage = this.add.bitmapText(576, 120, 'kenneyPixelSquareFont', this.gameEndMessage, 16);
        this.displayGameEndMessage.visible = false;
    }

    preload() {
        // Animated tile setup
        this.load.scenePlugin('AnimatedTiles', './lib/AnimatedTiles.js', 'animatedTiles', 'animatedTiles');
    }

    create() {
        this.map = this.add.tilemap("platformer-level-1", 18, 18, 80, 25);

        this.tilesetA = this.map.addTilesetImage("kenney_platformer_tileset", "tilemap_tiles");
        this.tilesetB = this.map.addTilesetImage("kenney_platformer_tileset", "tilemap_tiles");
        this.tilesetC = this.map.addTilesetImage("kenney_platformer_tileset", "tilemap_tiles");
        this.tilesetD = this.map.addTilesetImage("kenney_platformer_background_tileset", "tilemap_background_tiles");
        
        this.background = this.map.createLayer("Background", this.tilesetD, 0, 0);
        this.middleground = this.map.createLayer("Ground-Bg", this.tilesetC, 0, 0);
        this.water = this.map.createLayer("Water", this.tilesetB, 0, 0);
        this.foreground = this.map.createLayer("Ground-and-Platforms", this.tilesetA, 0, 0);

        this.foreground.setCollisionByProperty({
            collides: true
        });

        this.water.setCollisionByProperty({
            collides: true,
            water: true
        });

        this.collectibles = this.map.createFromObjects("Collectibles", {
            name: "coin",
            key: "tilemap_sheet",
            frame: 151
        });

        this.endLevel = this.map.createFromObjects("End_of_level", {
            name: "flag",
            key: "tilemap_sheet",
            frame: 112
        });

        // Since createFromObjects returns an array of regular Sprites, we need to convert 
        // them into Arcade Physics sprites (STATIC_BODY, so they don't move) 
        this.physics.world.enable(this.collectibles, Phaser.Physics.Arcade.STATIC_BODY);
        this.physics.world.enable(this.endLevel, Phaser.Physics.Arcade.STATIC_BODY);

        // Create a Phaser group out of the array this.collectibles
        // This will be used for collision detection below.
        this.collectibleGroup = this.add.group(this.collectibles);
        this.flagGroup = this.add.group(this.endLevel);

        // Play animated tiles
        this.animatedTiles.init(this.map);

        my.sprite.player = this.physics.add.sprite(30, 340, "platformer_characters", "tile_0000.png");
        my.sprite.player.setCollideWorldBounds(true);

        this.physics.add.collider(my.sprite.player, this.foreground);

        // Handle collision detection with coins
        this.physics.add.overlap(my.sprite.player, this.collectibleGroup, (obj1, obj2) => {
            obj2.destroy(); // remove coin on overlap
            this.score+= 100;
            this.sound.play("collectCoin", {
                volume: 0.1
            });
        });

        this.physics.add.overlap(my.sprite.player, this.flagGroup, (obj1, obj2) => {
            this.gameEnd = true; // end the level on overlap
        });

        this.displayGameEndMessage = this.add.bitmapText(576, 36, 'kenneyPixelSquareFont', this.gameEndMessage, 18);
        this.displayGameEndMessage.visible = false;

        cursors = this.input.keyboard.createCursorKeys();

        this.wKey = this.input.keyboard.addKey('W');
        this.aKey = this.input.keyboard.addKey('A');
        this.sKey = this.input.keyboard.addKey('S');
        this.dKey = this.input.keyboard.addKey('D');
        this.rKey = this.input.keyboard.addKey('R');

        this.input.keyboard.on('keydown-X', () => {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
            this.physics.world.debugGraphic.clear()
        }, this);

        // Create particle effects for player
        /*my.vfx.walking = this.add.particles(0, 0, "kenny-particles", {
            frame: ['smoke_03.png', 'smoke_09.png'],
            // TODO: Try: add random: true
            scale: {start: 0.03, end: 0.1},
            // TODO: Try: maxAliveParticles: 8,
            lifespan: 350,
            // TODO: Try: gravityY: -400,
            alpha: {start: 1, end: 0.1}, 
        });

        my.vfx.walking.stop();*/

        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(my.sprite.player, true, 0.25, 0.25); // (target, [,roundPixels][,lerpX][,lerpY])
        this.cameras.main.setDeadzone(50, 50);
        this.cameras.main.setZoom(this.SCALE);
    }


    update() {

        this.soundDelay++;

        // Player movement
        if(cursors.left.isDown || this.aKey.isDown) {
            my.sprite.player.setAccelerationX(-this.ACCELERATION);
            my.sprite.player.resetFlip();
            my.sprite.player.anims.play('walk', true);
           /*my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);
            my.vfx.walking.setPaticleSpeed(this.PARTICLE_VELOCITY, 0);
            if (my.sprite.player.body.blocked.down) {
                my.vfx.walking.start();
            }*/
            if (this.soundDelay > this.soundCue && my.sprite.player.body.blocked.down) {
                this.sound.play("playerMoving", {
                    volume: 0.5
                });
                this.soundDelay = 0;
            }
        } else if(cursors.right.isDown || this.dKey.isDown) {
            my.sprite.player.setAccelerationX(this.ACCELERATION);
            my.sprite.player.setFlip(true, false);
            my.sprite.player.anims.play('walk', true);
            /*my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);
            my.vfx.walking.setPaticleSpeed(this.PARTICLE_VELOCITY, 0);
            if (my.sprite.player.body.blocked.down) {
                my.vfx.walking.start();
            }*/
            if (this.soundDelay > this.soundCue && my.sprite.player.body.blocked.down) {
                this.sound.play("playerMoving", {
                    volume: 0.5
                });
                this.soundDelay = 0;
            }
        } else {
            my.sprite.player.setAccelerationX(0);
            my.sprite.player.setDragX(this.DRAG);
            my.sprite.player.anims.play('idle');
            // my.vfx.walking.stop();
        }

        // Player jump
        if(!my.sprite.player.body.blocked.down) {
            my.sprite.player.anims.play('jump');
        }
        if(my.sprite.player.body.blocked.down && (Phaser.Input.Keyboard.JustDown(cursors.up) || Phaser.Input.Keyboard.JustDown(this.wKey))) {
            my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);
        }

        if(Phaser.Input.Keyboard.JustDown(this.rKey)) {
            this.scene.restart();
        }

        if(my.sprite.player.y > 450) {
            my.sprite.player.x = 30;
            my.sprite.player.y = 340;
            my.sprite.player.setAccelerationX(0);
            my.sprite.player.setVelocityY(0);
        }

        if (this.gameEnd) {
            this.cameras.main.stopFollow();
            this.displayGameEndMessage.visible = true;
            this.displayScore = this.add.bitmapText(572, 108, 'kenneyPixelSquareFont', 'Your score is ' + this.score + '!', 18);
        }
    }
}