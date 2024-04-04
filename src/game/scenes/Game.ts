import { Scene } from "phaser";

export class Game extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameText: Phaser.GameObjects.Text;
    timedEvent: Phaser.Time.TimerEvent;
    alphabet: string[] = [];
    loop = 2;
    letters: Phaser.Physics.Arcade.Image[] = [];

    constructor() {
        super("Game");
    }
    preload() {
        this.load.setPath("assets/submarine/");

        // preload background
        this.load.atlas(
            "sea",
            "seacreatures_json.png",
            "seacreatures_json.json"
        );
        this.load.image("undersea", "undersea.jpg");
        this.load.image("coral", "seabed.png");
        // preload letters images
        for (let i = 97; i <= 122; i++) {
            const letter = String.fromCharCode(i);
            this.alphabet.push(letter);
            this.load.image(letter, "letters/" + letter + ".png");
        }
    }
    create() {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0xeeeeee);
        this.createBackgroundAnimation();

        // Call a method every loop seconds
        this.timedEvent = this.time.addEvent({
            delay: this.loop * 1000,
            callback: this.createRandomLetter,
            callbackScope: this,
            loop: true,
        });

        this.input.keyboard?.on("keydown", (event: { key: string }) => {
            this.clickOnLetter(event.key);
        });
        this.createRandomLetter();
    }
    update() {
        this.letters.forEach((_) => {
            const bottom = this.game.config.height as number;
            if (_.y >= bottom - 10) {
                _.setVelocity(0, 0); // stop
            }
        });
    }
    createBackgroundAnimation() {
        this.add.image(400, 300, "undersea");

        //  Create the Animations
        //  These are stored globally, and can be used by any Sprite

        //  In the texture atlas the jellyfish uses the frame names blueJellyfish0000 to blueJellyfish0032
        //  So we can use the handy generateFrameNames function to create this for us (and so on)
        this.anims.create({
            key: "jellyfish",
            frames: this.anims.generateFrameNames("sea", {
                prefix: "blueJellyfish",
                end: 32,
                zeroPad: 4,
            }),
            repeat: -1,
        });
        this.anims.create({
            key: "crab",
            frames: this.anims.generateFrameNames("sea", {
                prefix: "crab1",
                end: 25,
                zeroPad: 4,
            }),
            repeat: -1,
        });
        this.anims.create({
            key: "octopus",
            frames: this.anims.generateFrameNames("sea", {
                prefix: "octopus",
                end: 24,
                zeroPad: 4,
            }),
            repeat: -1,
        });
        this.anims.create({
            key: "purpleFish",
            frames: this.anims.generateFrameNames("sea", {
                prefix: "purpleFish",
                end: 20,
                zeroPad: 4,
            }),
            repeat: -1,
        });
        this.anims.create({
            key: "stingray",
            frames: this.anims.generateFrameNames("sea", {
                prefix: "stingray",
                end: 23,
                zeroPad: 4,
            }),
            repeat: -1,
        });

        const jellyfish = this.add
            .sprite(400, 300, "seacreatures")
            .play("jellyfish");
        const bigCrab = this.add
            .sprite(550, 480, "seacreatures")
            .setOrigin(0)
            .play("crab");
        const smallCrab = this.add
            .sprite(730, 515, "seacreatures")
            .setScale(0.5)
            .setOrigin(0)
            .play("crab");
        const octopus = this.add
            .sprite(100, 100, "seacreatures")
            .play("octopus");
        const fish = this.add
            .sprite(600, 200, "seacreatures")
            .play("purpleFish");
        const ray = this.add.sprite(100, 300, "seacreatures").play("stingray");

        this.add.image(0, 466, "coral").setOrigin(0);
    }
    createRandomLetter() {
        // Define the position
        const x = Phaser.Math.Between(0, this.game.config.width as number);
        const y = 0; // Phaser.Math.Between(0, config.height);

        const letter = String.fromCharCode(Phaser.Math.Between(0, 25) + 97);

        const logo = this.physics.add.image(x, y, letter);
        // logo.title = letter;
        logo.setAccelerationY(10); // Decrease acceleration
        logo.setGravity(0, 1); // Decrease gravity
        logo.setVelocity(0, 2); // Decrease velocity
        logo.setOrigin(0, 1);
        this.letters.push(logo);
    }
    clickOnLetter(letter: string) {
        // const lettersToDelete = this.letters.filter((_) => _.title === letter);
        // lettersToDelete.forEach((_) => _.destroy());
        // // Supprimer les objets du tableau global
        // this.letters = this.letters.filter(
        //     (_) => !lettersToDelete.includes(_)
        // );
    }

    changeScene() {
        this.scene.start("GameOver");
    }
}
