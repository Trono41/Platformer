class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload() {
        // Load assets
        this.load.setPath("./assets/");

        // Load characters spritesheet
        this.load.atlas("platformer_characters", "tilemap-characters-packed.png", "tilemap-characters-packed.json");

        // Load tilemap information
        this.load.image("tilemap_tiles", "tilemap_packed.png");
        this.load.image("tilemap_background_tiles", "tilemap-backgrounds_packed.png");
        this.load.tilemapTiledJSON("platformer-level-1", "platformer-level-1.tmj");

        // Load the tilemap as a spritesheet
        this.load.spritesheet("tilemap_sheet", "tilemap_packed.png", {
            frameWidth: 18,
            frameHeight: 18
        });

        this.load.spritesheet("tilemap_background_sheet", "tilemap-backgrounds_packed.png", {
            frameWidth: 24,
            frameHeight: 24
        });

        // Load particle effects
        this.load.multiatlas("kenny-particles", "kenny-particles.json");

        // Load bitmap font
        this.load.bitmapFont('kenneyPixelSquareFont', 'kenney_pixel_square_font_0.png', 'kenney_pixel_square_font.fnt');

        // Load audio
        this.load.audio("playerMoving", "footstep_grass_004.ogg");
        this.load.audio("collectCoin", "glass_004.ogg");
    }

    create() {
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNames('platformer_characters', {
                prefix: "tile_",
                start: 0,
                end: 1,
                suffix: ".png",
                zeroPad: 4
            }),
            frameRate: 15,
            repeat: -1
        });

        this.anims.create({
            key: 'idle',
            defaultTextureKey: "platformer_characters",
            frames: [
                { frame: "tile_0000.png" }
            ],
            repeat: -1
        });

        this.anims.create({
            key: 'jump',
            defaultTextureKey: "platformer_characters",
            frames: [
                { frame: "tile_0001.png" }
            ]
        });

        this.scene.start("platformerLevelScene");
    }
}