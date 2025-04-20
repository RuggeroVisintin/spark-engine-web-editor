import { GameObject, IEntity, Rgb, TransformComponent } from "sparkengineweb";
import IDebuggerEntity from "./IDebuggerEntity";

let UNIQUE_COUNTER = 0;

export class EntityOutline extends GameObject implements IDebuggerEntity {
    constructor() {
        super({
            name: UNIQUE_COUNTER === 0 ? 'EntityOutline' : `EntityOutline${UNIQUE_COUNTER}`,
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

        UNIQUE_COUNTER++;
    }

    match(target: IEntity): void {
        const debuggerTransform = this.getComponent<TransformComponent>('TransformComponent');
        const targetTransform = target.getComponent<TransformComponent>('TransformComponent');

        if (!targetTransform || !debuggerTransform) {
            return;
        }

        debuggerTransform.position = targetTransform.position;
        debuggerTransform.size = targetTransform.size;
    }
}