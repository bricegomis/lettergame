import { Scene } from "phaser";
import { EventBus } from "../EventBus";
import { LetterBlock } from "../Models/LetterBlock";

export class Game extends Scene {
    gameText: Phaser.GameObjects.Text;
    timedEvent: Phaser.Time.TimerEvent;
    remainingLetters: string[] = [];
    loopInSec = 1;
    letters: LetterBlock[] = [];
    particleEmitter: Phaser.GameObjects.Particles.ParticleEmitter;
    points: number = 0;
    letterTexts: Phaser.GameObjects.Text[];

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
            this.remainingLetters.push(letter);
            // const letterText = this.add
            // .text(10, 10, letter, {
            //     fontFamily: "Arial Black",
            //     fontSize: 30,
            //     color: "#00a6ed",
            // })
            // .setStroke("#2d2d2d", 3)
            // .setShadow(4, 4, "#000000", 8, true, false);
            // this.letterTexts.push(letterText);
            // const text = this.add.text(100, 0, 'Phaser 3', { font: '32px Arial', fill: '#00ff00' });
            // const text2 = this.add.text(100, -100, 'Phaser 3', { font: '32px Arial', fill: '#ffff00' });

            // const matterText = this.matter.add.gameObject(text, { shape: { type: 'polygon', sides: 8, radius: 64 } }).setFrictionAir(0.001).setBounce(0.9);
            // const matterText2 = this.matter.add.gameObject(text2).setBounce(0.9);
        }
    }
    preloadGemmes() {
        this.load.atlas("flares", "flares/flares.png", "flares/flares.json");
    }
    create() {
        EventBus.on("speed_changed", this.onSpeedchanged, this);
        this.refreshTimedLoop();
        this.createKeydownEvent();
        // this.createLetters();
        // container.body?.setVelocity(100, 200);
        // container.body?.setBounce(1, 1);
        // container.body?.setCollideWorldBounds(true);

        this.createParticles();
    }
    onSpeedchanged(speed: number) {
        // console.log("onSpeedchanged", speed);
        this.loopInSec = speed;
    }
    createLetter(letter: string) {
        // Define the position
        const x = Phaser.Math.Between(30, this.game.config.width as number - 50);
        const y = -50;
        const container = this.add.container(x, y);
        const bg = this.add.rectangle(100, 0, 40, 50, 0xdddddd, 1);
        bg.setOrigin(0.5);

        // Création du texte
        const text = this.add.text(100, 0, letter.toUpperCase(), {
            fontFamily: "Arial",
            fontSize: 32,
            color: "#000000",
        });
        text.setOrigin(0.5);

        // Ajout du fond et du texte au conteneur
        container.add([bg, text]);

        // Animation de déplacement
        const tween:Phaser.Types.Tweens.TweenBuilderConfig = {
            targets: container,
            y: (this.game.config.height as number) - bg.height / 2, // Nouvelle position en y
            duration: 2000, // Durée de l'animation en ms
            onComplete: () => { letterBlock.isOnBottom = true; }
        }
        const anim = this.tweens.add(tween);
        const letterBlock = {
            anim: anim,
            letter: letter,
            container: container,
            isOnBottom: false
        };

        this.letters.push();
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
            this.clickOnLetter(event.key.toUpperCase());
        });
    }
    refreshTimedLoop() {
        const config = {
            delay: this.loopInSec * 1000,
            callback: this.onLoop,
            callbackScope: this,
            loop: true,
        };
        if (this.timedEvent) this.timedEvent.reset(config);
        else this.timedEvent = this.time.addEvent(config);
    }
    onLoop() {
        this.createRandomLetter();
    }
    update() {
        this.letters.forEach((_) => {
            const bottom = this.game.config.height as number;
            if (_.container.y >= bottom - 10) {
                console.log(_.anim)
                _.isOnBottom = true;
            }
        });
    }
    createRandomLetter() {
        if (this.remainingLetters.length <= 0) return;

        const randomIndex = Math.floor(
            Math.random() * this.remainingLetters.length
        );
        const letter = this.remainingLetters.splice(randomIndex, 1)[0];
        this.createLetter(letter);
    }
    clickOnLetter(letter: string) {
        const lettersToDelete = this.letters.filter((_) => _.letter === letter);
        lettersToDelete.forEach((_) => _.container?.destroy());
        // Supprimer les objets du tableau global
        this.letters = this.letters.filter((_) => !lettersToDelete.includes(_));
        if (lettersToDelete.length <= 0) return;

        this.points += lettersToDelete[0].isOnBottom ? 10 : 50;
        EventBus.emit("points_changed", this.points);

        this.createGemmeOnLetter(lettersToDelete[0]);
    }
    createGemmeOnLetter(letter: LetterBlock) {
        this.particleEmitter.emitParticleAt(
            letter.container.x,
            letter.container.y,
            !letter.isOnBottom ? 4 : 2
        );
    }
    changeScene() {
        this.scene.start("GameOver");
    }
}
