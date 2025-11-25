import { Scene } from "three";
import Experience from "../Experience";
import * as THREE from "three"
import Environment from "./Environment";
import Resources from "../utils/Resources";
import Terrain from "./Terrain";
import Tree from "./Tree";
import Grass from "./Grass";
import Bush from "./Bush";
import Sky from "./Sky";
import Leaves from "./Leaves";
import Fog from "./Fog";
import Rocks from "./Rocks";
import Lab from "./Lab";
import Player from "./Player";
import Physics from "../Physics";

export default class World {
    private experience!: Experience
    private scene!: Scene
    public environment!: Environment
    public resources!: Resources

    public terrain!: Terrain
    public tree!: Tree
    public grass!: Grass
    public bush!: Bush
    public sky!: Sky
    public leaves!: Leaves
    public fog!: Fog
    public rocks!: Rocks
    public lab!: Lab
    public player!: Player
    public physics!: Physics

    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.physics = this.experience.physics
        this.resources.startLoading()

        const testMesh = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshStandardMaterial({
                metalness: 1,
                roughness: 0.2
            })
        )
        testMesh.position.set(2, 0, 2)
        this.scene.add(testMesh)

        this.resources.on("ready", () => {
            this.environment = new Environment()

            this.terrain = new Terrain()
            this.grass = new Grass()
            // this.bush = new Bush()
            this.tree = new Tree()
            this.player = new Player()
            this.leaves = new Leaves()
            this.sky = new Sky()
            this.fog = new Fog()
            this.lab = new Lab()
            this.rocks = new Rocks()
        })
    }

    public update(){
        if(this.grass)
        this.grass.update()

        if(this.bush)
        this.bush.update()

        if(this.player)
        this.player.update()

        if(this.physics)
        this.physics.update()

        if(this.leaves)
        this.leaves.update()

    }

}