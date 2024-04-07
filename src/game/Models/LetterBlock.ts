export class LetterBlock {
    anim: Phaser.Tweens.Tween;
    container: Phaser.GameObjects.Container;
    letter: string;
    isOnBottom: boolean;

    constructor(letter: string) {
        // this.img = img;
        this.letter = letter;
    }
}