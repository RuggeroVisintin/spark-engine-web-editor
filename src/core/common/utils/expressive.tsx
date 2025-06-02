export type Optional<T> = T | undefined | null;

export type Factory<T extends abstract new (...args: any) => any> = (...args: ConstructorParameters<T>) => InstanceType<T>;