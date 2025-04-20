import { GameObject, Rgb } from "sparkengineweb";

export class EntityOutline extends GameObject {
    constructor() {
        super({
            name: 'DebuggerEntity',
            material: {
                diffuseColor: new Rgb(255, 255, 0)
            },
            shape: {
                isWireframe: true
            },
            transform: {
                depthIndex: 0
            }
        });
    }
}