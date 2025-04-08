export class WeakRef<T = unknown> {
    constructor(private ref?: T) { }

    get(): T | undefined {
        return this.ref;
    }

    isEmpty(): boolean {
        return !!!this.ref;
    }
}