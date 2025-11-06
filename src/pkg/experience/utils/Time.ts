import EventEmitter from "./EventEmitter"

export default class Time extends EventEmitter {
    private start: number
    public current: number
    public elapsed: number
    public delta: number

    constructor() {
        super()

        this.start = Date.now()
        this.current = this.start
        this.elapsed = 0
        this.delta = 16

        this.tick = this.tick.bind(this)
        requestAnimationFrame(this.tick)
    }

    public tick() {
        const currentTime = Date.now()
        this.delta = currentTime - this.current
        this.current = currentTime
        this.elapsed = this.current - this.start

        this.trigger("tick")

        requestAnimationFrame(this.tick)
    }
}
