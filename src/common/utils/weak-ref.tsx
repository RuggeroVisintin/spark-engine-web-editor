export class WeakRef<T = unknown> {
    constructor(private readonly ref: T) { }

    get(): T {
        return this.ref;
    }

    isEmpty(): boolean {
        return this.ref === null;
    }
}