import { Scene } from "phaser";

class LetterBlock {
    img: Phaser.Physics.Arcade.Image;
    letter: string;
    isOnBottom: boolean;

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
    particleEmitter: Phaser.GameObjects.Particles.ParticleEmitter;
    points: number;
    pointsText: Phaser.GameObjects.Text;

    constructor() {
        super("Game");
        this.points = 0;
    }
    preload() {
        this.load.setPath("assets");
        this.preloadSubmarine();
        this.preloadLetters();
        this.preloadGemmes();
    }
    preloadSubmarine() {
        // preload background
        this.load.atlas(
            "sea",
            "submarine/seacreatures_json.png",
            "submarine/seacreatures_json.json"
        );
        this.load.image("undersea", "submarine/undersea.jpg");
        this.load.image("coral", "submarine/seabed.png");
    }
    preloadLetters() {
        // preload letters images
        for (let i = 97; i <= 122; i++) {
            const letter = String.fromCharCode(i);
            this.alphabet.push(letter);
            this.load.image(letter, "letters/" + letter + ".png");
        }
    }
    preloadGemmes() {
        this.load.atlas("gems", "gemmes/gems.png", "gemmes/gems.json");
        this.load.atlas("flares", "flares/flares.png", "flares/flares.json");
    }
    create() {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0xeeeeee);
        this.createBackgroundAnimation();
        this.createLoop();
        this.createKeydownEvent();
        this.createParticles();
        this.createTexts();
    }
    createTexts() {
        this.pointsText = this.add
            .text(10, 10, "Points: ", { fontFamily: 'Arial Black', fontSize: 30, color: '#00a6ed' })
            .setStroke("#2d2d2d", 3)
            .setShadow(4, 4, "#000000", 8, true, false);
    }
    createParticles() {
        this.particleEmitter = this.add.particles(0, 0, "flares", {
            frame: ["red", "yellow", "green"],
            lifespan: 500,
            speed: { min: 150, max: 250 },
            scale: { start: 0.8, end: 0 },
            gravityY: 150,
            blendMode: "ADD",
            emitting: false,
        });
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
            if (_.img.y >= bottom - 10) {
                _.img.setVelocity(0, 0); // stop
                _.isOnBottom = true;
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
        this.letters = this.letters.filter((_) => !lettersToDelete.includes(_));
        if (lettersToDelete.length <= 0) return;

        this.points += lettersToDelete[0].isOnBottom ? 10 : 50;
        this.pointsText.setText(`Points: ${this.points}`);
        this.createGemmeOnLetter(lettersToDelete[0]);
    }
    createGemmeOnLetter(letter: LetterBlock) {
        this.particleEmitter.emitParticleAt(
            letter.img.x,
            letter.img.y,
            !letter.isOnBottom ? 4 : 2
        );
    }
    changeScene() {
        this.scene.start("GameOver");
    }
}
