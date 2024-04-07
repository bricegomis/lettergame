import { Scene } from "phaser";

class LetterBlock {
    img: Phaser.Physics.Arcade.Image;
    letter: string;

    constructor(img: Phaser.Physics.Arcade.Image, letter: string) {
        this.img = img;
        this.letter = letter;
    }
}

export class Game extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameText: Phaser.GameObjects.Text;
    timedEvent: Phaser.Time.TimerEvent;
    alphabet: string[] = [];
    loop = 2;
    letters: LetterBlock[] = [];

    constructor() {
        super("Game");
    }
    preload() {
        this.preloadSubmarine();
        this.preloadLetters();
        this.preloadGemmes();
    }
    preloadSubmarine() {
        this.load.setPath("assets/submarine/");

        // preload background
        this.load.atlas(
            "sea",
            "seacreatures_json.png",
            "seacreatures_json.json"
        );
        this.load.image("undersea", "undersea.jpg");
        this.load.image("coral", "seabed.png");
    }
    preloadLetters() {
        this.load.setPath("assets/");
        // preload letters images
        for (let i = 97; i <= 122; i++) {
            const letter = String.fromCharCode(i);
            this.alphabet.push(letter);
            this.load.image(letter, "letters/" + letter + ".png");
        }
    }
    preloadGemmes() {
        this.load.setPath("assets/gemmes/");
        this.load.atlas('gems', 'gems.png', 'gems.json');
    }
    create() {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0xeeeeee);
        this.createBackgroundAnimation();

        this.anims.create({ key: 'ruby', frames: this.anims.generateFrameNames('gems', { prefix: 'ruby_', end: 6, zeroPad: 4 }), repeat: -1 });

        // Call a method every loop seconds
        this.createLoop();

        this.createKeydownEvent();
    }
    createKeydownEvent() {
        this.input.keyboard?.on("keydown", (event: { key: string }) => {
            this.clickOnLetter(event.key);
        });
    }
    createLoop() {
        this.timedEvent = this.time.addEvent({
            delay: this.loop * 1000,
            callback: this.onLoop,
            callbackScope: this,
            loop: true,
        });
    }
    onLoop() {
        this.createRandomLetter();
    }
    update() {
        this.letters.forEach((_) => {
            const bottom = this.game.config.height as number;
            if (_.y >= bottom - 10) {
                _.img.setVelocity(0, 0); // stop
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

        const img = this.physics.add.image(x, y, letter);
        // logo.title = letter;
        img.setAccelerationY(10); // Decrease acceleration
        img.setGravity(0, 1); // Decrease gravity
        img.setVelocity(0, 2); // Decrease velocity
        img.setOrigin(0, 1);
        const letterBlock = new LetterBlock(img, letter);
        this.letters.push(letterBlock);
    }
    clickOnLetter(letter: string) {
        const lettersToDelete = this.letters.filter((_) => _.letter === letter);
        lettersToDelete.forEach((_) => _.img.destroy());
        // Supprimer les objets du tableau global
        this.letters = this.letters.filter(
            (_) => !lettersToDelete.includes(_)
        );
        if (lettersToDelete.length <= 0) return;
        this.createGemme(lettersToDelete[0].img.x, lettersToDelete[0].img.y);
    }

    createGemme(x: number, y: number) {
        // this.anims.create({ key: 'square', frames: this.anims.generateFrameNames('gems', { prefix: 'square_', end: 14, zeroPad: 4 }), repeat: -1 });
        ///x = y = 0;
        this.add.sprite(x, y, "gems").play("ruby");
        // this.make.sprite({
        //     key: 'gems',
        //     x: { randInt: x },
        //     y: { randInt: y },
        //     scale: { randFloat: 1 },
        //     anims: 'ruby'
        // });

        //  A more complex animation config object.
        //  This time with a call to delayedPlay that's a function.
        // const config2 = {
        //     key: 'gems',
        //     frame: 'square_0000',
        //     x: { randInt: [0, 800] },
        //     y: { randInt: [300, 600] },
        //     scale: { randFloat: [0.5, 1.5] },
        //     // anims: {
        //     //     key: 'square',
        //     //     repeat: -1,
        //     //     repeatDelay: { randInt: [1000, 4000] },
        //     //     delayedPlay: function () {
        //     //         return Math.random() * 6000;
        //     //     }
        //     // }
        // };

        //  Make 16 sprites using the config above
        // for (let i = 0; i < 16; i++) {
        // this.make.sprite(config2);
        // }
    }

    changeScene() {
        this.scene.start("GameOver");
    }
}
