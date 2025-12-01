import { Scene } from "three";
import Experience from "../Experience";
import { CycleKeys, Cycles, cyclesKeyFrame, CyclesKeyFrame } from "../utils/CycleKeyFrame";

export default class Cycle {
    private experience: Experience;
    public scene: Scene;
    private cycleKeyFrame: CyclesKeyFrame
    private END_OF_CYCLETIME = 900000

    public cycleA: CycleKeys;
    public cycleB: CycleKeys;
    public blend: number;

    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.cycleKeyFrame = cyclesKeyFrame

        this.cycleA = cyclesKeyFrame.day;
        this.cycleB = cyclesKeyFrame.afternoon;
        this.blend = 0;
    }


    update() {
        const t = (this.experience.time.elapsed % this.END_OF_CYCLETIME) / this.END_OF_CYCLETIME;

        if (t < 0.33) {
            this.cycleA = this.cycleKeyFrame.day
            this.cycleB = this.cycleKeyFrame.afternoon
            this.blend = t / 0.33
        }
        if (t < 0.66) {
            this.cycleA = this.cycleKeyFrame.afternoon;
            this.cycleB = this.cycleKeyFrame.dusk;
            this.blend = (t - 0.33) / 0.33;
        }
        else {
            this.cycleA = this.cycleKeyFrame.dusk;
            this.cycleB = this.cycleKeyFrame.day;
            this.blend = (t - 0.66) / 0.34;
        }
    }
}