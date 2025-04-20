import { IEntity, Scene } from "@sparkengine";
import IDebuggerEntity from "../IDebuggerEntity";

export class SetDebuggerEntityUseCase {
    constructor(
        private readonly debuggerScene: Scene
    ) { }

    public execute(target: IEntity): void {
        this.debuggerScene.entities.forEach((entity) => {
            const debuggerEntity: IDebuggerEntity = entity as IDebuggerEntity;

            if (!debuggerEntity.match) {
                return;
            }

            debuggerEntity.match(target);
        });
    }
}