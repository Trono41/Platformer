class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload() {
        // Load assets
        this.load.setPath("./assets/");
    }

    create() {
        this.scene.start("platformerLevelScene");
    }
}