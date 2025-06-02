const config = {
    di: {} as Record<string, { concrete: InstanceType<any>; instance: any }>,
}

export const DI = {
    alias(typeName: string, concrete: InstanceType<any>) {
        config.di[typeName] = { concrete, instance: null };
    },
    override(typeName: string, instance: any) {
        if (!config.di[typeName]) {
            throw new Error(`No class found for type: ${typeName}`);
        }

        if (config.di[typeName].concrete && config.di[typeName].concrete !== typeof instance) {
            throw new Error(`Type mismatch for ${typeName}. Expected ${config.di[typeName].concrete}, but got ${typeof instance}`);
        }

        config.di[typeName].instance = instance;
        if (!config.di[typeName].concrete) {
            config.di[typeName].concrete = typeof instance;
        }
    },
    createInstance<T>(typeName: string, deps?: any[]) {
        if (!config.di[typeName]) {
            throw new Error(`No class found for type: ${typeName}`);
        }

        return new config.di[typeName].concrete(...(deps || [])) as T;
    }
};

export type Factory<T extends abstract new (...args: any) => any> = (...args: ConstructorParameters<T>) => InstanceType<T>;