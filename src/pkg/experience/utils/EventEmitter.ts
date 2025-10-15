type Callback = (...args: any[]) => any

interface CallbackMap {
    [namespace: string]: {
        [event: string]: Callback[]
    }
}

interface ResolvedName {
    original: string
    value: string
    namespace: string
}

export default class EventEmitter {
    private callbacks: CallbackMap

    constructor() {
        this.callbacks = {}
        this.callbacks.base = {}
    }

    on(_names: string, callback: Callback): this | false {
        if (!_names) {
            console.warn("wrong names")
            return false
        }
        if (!callback) {
            console.warn("wrong callback")
            return false
        }

        const names = this.resolveNames(_names)
        names.forEach((_name) => {
            const name = this.resolveName(_name)

            if (!(this.callbacks[name.namespace] instanceof Object)) {
                this.callbacks[name.namespace] = {}
            }

            if (!(this.callbacks[name.namespace][name.value] instanceof Array)) {
                this.callbacks[name.namespace][name.value] = []
            }

            this.callbacks[name.namespace][name.value].push(callback)
        })

        return this
    }

    off(_names: string): this | false {
        if (!_names) {
            console.warn("wrong name")
            return false
        }

        const names = this.resolveNames(_names)

        names.forEach((_name) => {
            const name = this.resolveName(_name)

            if (name.namespace !== "base" && name.value === "") {
                delete this.callbacks[name.namespace]
            } else {
                if (name.namespace === "base") {
                    for (const namespace in this.callbacks) {
                        if (
                            this.callbacks[namespace] instanceof Object &&
                            this.callbacks[namespace][name.value] instanceof Array
                        ) {
                            delete this.callbacks[namespace][name.value]

                            if (Object.keys(this.callbacks[namespace]).length === 0) {
                                delete this.callbacks[namespace]
                            }
                        }
                    }
                } else if (
                    this.callbacks[name.namespace] instanceof Object &&
                    this.callbacks[name.namespace][name.value] instanceof Array
                ) {
                    delete this.callbacks[name.namespace][name.value]
                    if (Object.keys(this.callbacks[name.namespace]).length === 0) {
                        delete this.callbacks[name.namespace]
                    }
                }
            }
        })

        return this
    }

    trigger(_name: string, _args?: any[]): any {
        if (!_name) {
            console.warn("wrong name")
            return false
        }

        let finalResult: any = null
        let result: any = null

        const args = _args instanceof Array ? _args : []

        let name = this.resolveNames(_name)
        name = this.resolveName(name[0])

        if (name.namespace === "base") {
            for (const namespace in this.callbacks) {
                if (this.callbacks[namespace][name.value] instanceof Array) {
                    this.callbacks[namespace][name.value].forEach((callback) => {
                        result = callback.apply(this, args)
                        if (typeof finalResult === "undefined") {
                            finalResult = result
                        }
                    })
                }
            }
        } else if (this.callbacks[name.namespace] instanceof Object) {
            if (name.value === "") {
                console.warn("wrong name")
                return this
            }
            this.callbacks[name.namespace][name.value].forEach((callback) => {
                result = callback.apply(this, args)
                if (typeof finalResult === "undefined") {
                    finalResult = result
                }
            })
        }

        return finalResult
    }

    private resolveNames(_names: string): string[] {
        let names = _names.replace(/[^a-zA-Z0-9 ,/.]/g, "")
        names = names.replace(/[,/]+/g, " ")
        names = names.split(" ")
        return names
    }

    private resolveName(name: string): ResolvedName {
        const parts = name.split(".")
        return {
            original: name,
            value: parts[0],
            namespace: parts[1] || "base",
        }
    }
}
