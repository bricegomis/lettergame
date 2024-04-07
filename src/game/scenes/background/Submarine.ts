function stop(item: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody) {
    item.setAccelerationY(0);
    item.setGravity(0, -50);
    item.setVelocity(0, 0);
    item.setAngularVelocity(0);
}

export class Submarine extends Phaser.Scene {
    constructor() {
        super({ key: "Submarine", active: true });
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
    }

    create() {
        this.add.image(400, 300, "undersea");

        //  Create the Animations
        //  These are stored globally, and can be used by any Sprite

        //  In the texture atlas the jellyfish uses the frame names blueJellyfish0000 to blueJellyfish0032
        //  So we can use the handy generateFrameNames function to create this for us (and so on)
        const jellyfish = this.createFish(
            400,
            300,
            "jellyfish",
            "blueJellyfish",
            10,
            0
        );
        this.createFish(520, 530, "crab", "crab1");
        
        this.createFish(100, 100, "octopus", "octopus");
        this.createFish(600, 200, "purpleFish", "purpleFish");
        this.createFish(100, 300, "stingray", "stingray");

        this.add.image(0, 466, "coral").setOrigin(0);
        this.createFish(200, 550, "crab2", "crab1");
    }

    createFish(
        x: number,
        y: number,
        key: string,
        prefix: string,
        gravityX: number = 0,
        gravityY: number = -50
    ) {
        const jellyfish = this.physics.add.sprite(x, y, "sea");
        this.anims.create({
            key: key,
            frames: this.anims.generateFrameNames("sea", {
                prefix: prefix,
                end: 32,
                zeroPad: 4,
            }),
            repeat: -1,
        });
        jellyfish.anims.play({
            key: key,
            frameRate: 6
        });
        jellyfish.setGravity(gravityX, gravityY);
        jellyfish.setBounce(1, 1);
        jellyfish.setCollideWorldBounds(true);
        return jellyfish;
    }
}
