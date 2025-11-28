import { Scene } from "three";
import Experience from "../Experience";
import { CycleKeys, Cycles, cyclesKeyFrame, CyclesKeyFrame } from "../utils/CycleKeyFrame";

export default class Cycle {
    private experience: Experience;
    public scene: Scene;
    private cycleKeyFrame: CyclesKeyFrame
    public currentCycle:CycleKeys
    private END_OF_CYCLETIME = 900000
    private lastCycle: string | null = null;

    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.cycleKeyFrame = cyclesKeyFrame
        this.currentCycle = this.cycleKeyFrame["day"]
    }


    update() {
        const elapsed = this.experience.time.elapsed % this.END_OF_CYCLETIME;

        let newCycle: Cycles;

        if (elapsed < 300000) newCycle = "day";
        else if (elapsed < 600000) newCycle = "afternoon";
        else newCycle = "dusk";

        if (newCycle !== this.lastCycle) {
            this.currentCycle = this.cycleKeyFrame[newCycle];
            this.lastCycle = newCycle;
        }
    }

}