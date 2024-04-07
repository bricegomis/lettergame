import { Scene } from "phaser";
import { EventBus } from "../EventBus";
import { LetterBlock } from "../Models/LetterBlock";

export class Game extends Scene {
    gameText: Phaser.GameObjects.Text;
    timedEvent: Phaser.Time.TimerEvent;
    alphabet: string[] = [];
    loop = 2;
    letters: LetterBlock[] = [];
    particleEmitter: Phaser.GameObjects.Particles.ParticleEmitter;
    points: number = 0;

    constructor() {
        super("Game");
    }
    preload() {
        this.load.setPath("assets");
        this.preloadLetters();
        this.preloadGemmes();
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
        this.load.atlas("flares", "flares/flares.png", "flares/flares.json");
    }
    create() {
        this.createLetterLoop();
        this.createKeydownEvent();
        this.createParticles();
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
    createLetterLoop() {
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
                _.img.setAccelerationY(0); // stop
                _.img.setGravity(0, 0); // stop
                _.isOnBottom = true;
            }
        });
    }
    createRandomLetter() {
        // Define the position
        const x = Phaser.Math.Between(0, this.game.config.width as number);
        const y = 0; // Phaser.Math.Between(0, config.height);

        const letter = String.fromCharCode(Phaser.Math.Between(0, 25) + 97);
        const img = this.physics.add.image(x, y, letter);
        // logo.title = letter;
        // img.setAccelerationY(10); // Decrease acceleration
        img.setGravity(0, -30); // Decrease gravity
        // img.setVelocity(0, 2); // Decrease velocity
        img.setOrigin(0, 1);
        img.setTint(0x000000);
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
        EventBus.emit("points_changed", this.points);

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
