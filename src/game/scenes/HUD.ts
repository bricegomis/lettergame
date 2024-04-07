import { EventBus } from "../EventBus";

function calculSpeed(y:number) {
    // Si y est inférieur à -50, x est entre 0 et 1
    if (y < -50) {
        return Math.min(Math.max(0, y / -50), 1);
    }
    // Si y est entre -50 et le maximum (150), x est incrémenté proportionnellement entre 1 et 100
    else {
        return Math.min(Math.max(1, y / 150 * 100), 100);
    }
}

export class HUD extends Phaser.Scene {
    pointsText: Phaser.GameObjects.Text;

    constructor() {
        super({ key: "HUD", active: true });
    }

    preload() {}

    create() {
        this.pointsText = this.add
            .text(10, 10, "Points: ", {
                fontFamily: "Arial Black",
                fontSize: 30,
                color: "#00a6ed",
            })
            .setStroke("#2d2d2d", 3)
            .setShadow(4, 4, "#000000", 8, true, false);
        // this.createSpeedSlider();
        EventBus.on("points_changed", this.onPointsChanged, this);
    }
    createSpeedSlider() {
        const slider = this.add.container(this.game.config.width as number - 20, 200);

        const bar = this.add.rectangle(0, 0, 12, 300, 0x9d9d9d);
        const control = this.add.circle(0, 0, 12, 0x0000ff);

        slider.add([bar, control]);

        control.setInteractive({ draggable: true });

        control.on("drag", function (pointer: any, dragX: any, dragY: number) {
            control.y = Phaser.Math.Clamp(dragY, -150, 150);
            EventBus.emit("speed_changed", calculSpeed(-control.y))
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
    onPointsChanged(points: number) {
        this.pointsText.setText(`Points: ${points}`);
    }
}
