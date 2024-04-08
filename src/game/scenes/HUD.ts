import { EventBus } from "../EventBus";

function calculSpeed(y: number) {
    // Si y est inférieur à -50, x est entre 0 et 1
    if (y < -50) {
        return Math.min(Math.max(0, y / -50), 1);
    }
    // Si y est entre -50 et le maximum (150), x est incrémenté proportionnellement entre 1 et 100
    else {
        return Math.min(Math.max(1, (y / 150) * 100), 100);
    }
}

export class HUD extends Phaser.Scene {
    pointsText: Phaser.GameObjects.Text;
    timeText: Phaser.GameObjects.Text;

    constructor() {
        super({ key: "HUD", active: true });
    }

    preload() {
        this.load.image("star", "assets/star.png");
    }

    create() {
        this.pointsText = this.add
            .text(this.game.config.width as number - 120, 10, "00000 ", {
                fontFamily: "supermario",
                fontSize: 32,
                color: "#000000",
            })
            // .setStroke("#2d2d2d", 3)
        this.timeText = this.add.text(10, 10, "", {
            fontFamily: "Arial",
            fontSize: 16,
            color: "#000000",
        });
        for(let y = 80; y < 100 + 40*5; y += 40) {
            this.add
            .image((this.game.config.width as number) - 20, y, "star")
            .setScale(0.5);
        }
        
        EventBus.on("points_changed", this.onPointsChanged, this);
    }
    createSpeedSlider() {
        const slider = this.add.container(
            (this.game.config.width as number) - 20,
            200
        );

        const bar = this.add.rectangle(0, 0, 12, 300, 0x9d9d9d);
        const control = this.add.circle(0, 0, 12, 0x0000ff);

        slider.add([bar, control]);

        control.setInteractive({ draggable: true });

        control.on("drag", function (pointer: any, dragX: any, dragY: number) {
            control.y = Phaser.Math.Clamp(dragY, -150, 150);
            EventBus.emit("speed_changed", calculSpeed(-control.y));
        });

        slider.setSize(12, 300);
        slider.setInteractive({ draggable: true });

        slider.on(
            "drag",
            function (pointer: any, dragX: number, dragY: number) {
                slider.x = dragX;
                slider.y = dragY;
            }
        );
    }
    update(time: any, delta: any) {
        this.timeText.setText(`Time: ${Math.round(time / 1000)}s`);
    }
    onPointsChanged(points: number) {
        // if (this.pointsText.active === false) this.pointsText.setActive(true);
        // console.log("this.pointsText.active false", this.pointsText);
        this.pointsText.setText(
            `${points.toString().padStart(6, "0")} `
        );
    }
}
