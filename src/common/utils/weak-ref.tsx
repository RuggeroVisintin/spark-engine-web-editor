export class WeakRef<T = unknown> {
    constructor(private readonly ref: T) { }

    get(): T {
        return this.ref;
    }
}