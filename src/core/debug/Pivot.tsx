import { GameObject, Rgb } from "sparkengineweb";

export default class Pivot extends GameObject {
    constructor() {
        super({
            name: 'Pivot',
            material: {
                diffuseColor: new Rgb(255, 255, 0)
            },
            shape: {
                isWireframe: false
            },
            transform: {
                depthIndex: 0
            }
        });
    }
}