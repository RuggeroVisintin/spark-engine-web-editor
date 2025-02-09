import { IEntity, Scene, TransformComponent } from "@sparkengine";

export class SetDebuggerEntityUseCase {
    constructor(private readonly debuggerScene?: Scene) { }

    public execute(target: IEntity, debuggerEntity: IEntity, shouldRegister = false): void {
        const debuggerTransform = debuggerEntity.getComponent<TransformComponent>('TransformComponent');
        const targetTransform = target.getComponent<TransformComponent>('TransformComponent');

        if (!targetTransform || !debuggerTransform) {
            return;
        }

        debuggerTransform.position = targetTransform.position;
        debuggerTransform.size = targetTransform.size;

        if (shouldRegister) {
            this.debuggerScene?.unregisterEntity(debuggerEntity.uuid);
            this.debuggerScene?.registerEntity(debuggerEntity);
        }
    }
}