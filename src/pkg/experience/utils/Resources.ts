import EventEmitter from "./EventEmitter";

export default class Resources extends EventEmitter {
    sources: any[]

    constructor(sources: any[]) {
        super()
        this.sources = sources
    }
}