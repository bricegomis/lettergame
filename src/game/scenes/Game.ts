import { Scene } from "phaser";
import { EventBus } from "../EventBus";
import { LetterBlock } from "../Models/LetterBlock";

export class Game extends Scene {
    private gameText: Phaser.GameObjects.Text;
    private timedEvent: Phaser.Time.TimerEvent;
    private remainingLetters: string[] = [];
    private letters: LetterBlock[] = [];
    private particleEmitter: Phaser.GameObjects.Particles.ParticleEmitter;
    private points: number = 0;
    private letterTexts: Phaser.GameObjects.Text[];
    private letterDurationInSec: number = 1;

    constructor() {
        super("Game");
    }

    preload() {
        this.load.setPath("assets");
        this.preloadLetters();
        this.preloadGemmes();
    }

    preloadLetters() {
        for (let i = 97; i <= 122; i++) {
            const letter = String.fromCharCode(i);
            this.remainingLetters.push(letter.toUpperCase());
        }
    }

    preloadGemmes() {
        this.load.atlas("flares", "flares/flares.png", "flares/flares.json");
    }

    create() {
        EventBus.on("speed_changed", this.onSpeedchanged, this);
        this.refreshTimedLoop();
        this.createKeydownEvent();
        this.createParticles();
    }

    private onSpeedchanged(speed: number) {
        // this.loopInSec = speed;
    }

    private createLetter(letter: string) {
        const x = Phaser.Math.Between(
            30,
            (this.game.config.width as number)-100
        );
        const y = -50;
        const container = this.add.container(x, y);
        const bg = this.add
            .rectangle(0, 0, 40, 50, 0xdddddd, 0.8)
            .setOrigin(0.5);

        const text = this.add
            .text(0, 0, letter, {
                fontFamily: "Arial",
                fontSize: 32,
                color: "#000000",
            })
            .setOrigin(0.5);

        container.add([bg, text]);

        const tweenConfig: Phaser.Types.Tweens.TweenBuilderConfig = {
            targets: container,
            y: (this.game.config.height as number) - bg.height / 2,
            duration: this.letterDurationInSec * 1000,
            onComplete: () => {
                letterBlock.isOnBottom = true;
            },
        };
        const anim = this.tweens.add(tweenConfig);
        const letterBlock = {
            anim: anim,
            letter: letter,
            container: container,
            isOnBottom: false,
        };

        this.letters.push(letterBlock);
    }

    private createParticles() {
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

    private createKeydownEvent() {
        this.input.keyboard?.on("keydown", (event: { key: string }) => {
            this.clickOnLetter(event.key.toUpperCase());
        });
    }

    private refreshTimedLoop() {
        const config = {
            delay: this.letterDurationInSec * 1000,
            callback: this.onLoop,
            callbackScope: this,
            loop: true,
        };
        if (this.timedEvent) this.timedEvent.reset(config);
        else this.timedEvent = this.time.addEvent(config);
    }

    private onLoop() {
        // this.onFinish()
        this.createRandomLetter();
    }

    update() {
        this._updateLetters();
    }

    private _updateLetters() {
        const bottom = this.game.config.height as number;
        this.letters.forEach((letterBlock) => {
            if (letterBlock.container.y >= bottom - 10) {
                letterBlock.isOnBottom = true;
            }
        });
    }

    private createRandomLetter() {
        if (this.remainingLetters.length <= 0) return;

        const randomIndex = Math.floor(
            Math.random() * this.remainingLetters.length
        );
        const letter = this.remainingLetters.splice(randomIndex, 1)[0];
        this.createLetter(letter);
    }

    private clickOnLetter(letter: string) {
        const lettersToDelete = this.letters.filter(
            (letterBlock) => letterBlock.letter === letter
        );
        lettersToDelete.forEach((letterBlock) =>
            letterBlock.container?.destroy()
        );
        this.letters = this.letters.filter(
            (letterBlock) => !lettersToDelete.includes(letterBlock)
        );

        // bad letter ?
        if (lettersToDelete.length <= 0) return;

        this.points += lettersToDelete[0].isOnBottom ? 10 : 50;
        EventBus.emit("points_changed", this.points);

        this.createGemmeOnLetter(lettersToDelete[0]);

        // The last letter => restart the game
        if (this.letters.length == 0 && this.remainingLetters.length == 0) {
            this.nextLevel();
        }
    }
    nextLevel() {
        this.letterDurationInSec--;
        if (this.letterDurationInSec>=1)
            this.preloadLetters();
        else{
            this.onFinish()
            this.add
            .text(this.game.config.width as number/2, this.game.config.height as number/2, "BRAVO", {
                fontFamily: "supermario",
                fontSize: 72,
                color: "#000000",
                backgroundColor: "white"
            })
            .setOrigin(0.5);
        }
    }

    private createGemmeOnLetter(letter: LetterBlock) {
        this.particleEmitter.emitParticleAt(
            letter.container.x,
            letter.container.y,
            !letter.isOnBottom ? 4 : 2
        );
    }

    private onFinish() {
        console.log("finish game")
        this.scene.stop()
        this.scene.start("Scores");
        
    }
}
