import { BaseEntity, GameEngine, GameObject, IEntity, Scene, Vec2 } from "@sparkengine";
import { SetDebuggerEntityUseCase } from './SetDebuggerEntityUseCase';
import IDebuggerEntity from "../IDebuggerEntity";

const engine = new GameEngine({
    framerate: 60,
    context: new CanvasRenderingContext2D(),
    resolution: {
        width: 800,
        height: 600
    }
})

class FakeDebuggerEntity extends BaseEntity implements IDebuggerEntity {
    public matchTarget?: IEntity;

    public match(target: IEntity): void {
        this.matchTarget = target;
    }
}


describe('core/scene/usecases/SetDebuggerEntityUseCase', () => {
    let debuggerEntity: FakeDebuggerEntity;
    let debuggerEntity2: FakeDebuggerEntity;
    let debuggerScene: Scene;
    let useCase: SetDebuggerEntityUseCase;
    let target: GameObject;

    beforeEach(() => {
        debuggerEntity = new FakeDebuggerEntity();
        debuggerEntity2 = new FakeDebuggerEntity();

        debuggerScene = new Scene();
        debuggerScene.registerEntity(debuggerEntity);
        debuggerScene.registerEntity(debuggerEntity2);

        target = new GameObject({
            transform: {
                position: new Vec2(15, 25),
                size: { width: 10, height: 30 }
            }
        });

        useCase = new SetDebuggerEntityUseCase(debuggerScene);
    });

    it('Should match the transform posizion and size of the debugger entities in the scene to the one of target', () => {
        useCase.execute(target);

        expect(debuggerEntity.matchTarget).toEqual(target);
    });

    it('Should not throw errors when the scene does not have a debuggerEntity', () => {
        const emptyScene = new Scene();
        const useCase = new SetDebuggerEntityUseCase(emptyScene);

        expect(() => {
            useCase.execute(target);
        }).not.toThrow();
    })
})