import { EventBus } from "../EventBus";

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

        EventBus.on("points_changed", this.onPointsChanged, this);
    }

    onPointsChanged(points: number) {
        console.log("onPointsChanged", points);
        this.pointsText.setText(`Points: ${points}`);
    }
}
