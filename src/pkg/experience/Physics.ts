import RAPIER from "@dimforge/rapier3d-compat";

export default class Physics{
    public world!: RAPIER.World;
    private ready: boolean = false

    constructor(){
        this.init()
    }

    private async init(){
        await RAPIER.init()

        this.world = new RAPIER.World({
            x: 0,
            y: -9.81,
            z: 0,
        })

        this.ready = true
    }

    public update(){
        if(this.ready){
            this.world.step()
        }
    }
}