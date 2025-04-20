import { GameObject, IEntity, incrementallyUnique, Rgb, TransformComponent, Type } from "sparkengineweb";
import IDebuggerEntity from "./IDebuggerEntity";

@Type('Pivot')
export default class Pivot extends GameObject implements IDebuggerEntity {
    constructor() {
        super({
            name: incrementallyUnique('Pivot'),
            material: {
                diffuseColor: new Rgb(255, 255, 0)
            },
            shape: {
                isWireframe: false
            },
            transform: {
                // Depth -1 ensures this is always drawn on top of everything else
                depthIndex: -1,
                size: {
                    width: 10,
                    height: 10
                }
            }
        });
    }

    match(target: IEntity): void {
        const debuggerTransform = this.getComponent<TransformComponent>('TransformComponent');
        const targetTransform = target.getComponent<TransformComponent>('TransformComponent');

        if (!targetTransform || !debuggerTransform) {
            return;
        }

        debuggerTransform.position = targetTransform.position;
    }
}