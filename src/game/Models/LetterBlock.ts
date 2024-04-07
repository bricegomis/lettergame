export class LetterBlock {
    img: Phaser.Physics.Arcade.Image;
    letter: string;
    isOnBottom: boolean;

    constructor(img: Phaser.Physics.Arcade.Image, letter: string) {
        this.img = img;
        this.letter = letter;
    }
}