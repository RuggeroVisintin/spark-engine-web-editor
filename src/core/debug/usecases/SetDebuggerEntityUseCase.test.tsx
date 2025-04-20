import { GameEngine, GameObject, Scene, Vec2 } from "@sparkengine";
import { SetDebuggerEntityUseCase } from './SetDebuggerEntityUseCase';
import { EntityOutline } from "../EntityOtuline";

const engine = new GameEngine({
    framerate: 60,
    context: new CanvasRenderingContext2D(),
    resolution: {
        width: 800,
        height: 600
    }
})


describe('core/scene/usecases/SetDebuggerEntityUseCase', () => {
    let debuggerEntity: EntityOutline;
    let debuggerEntity2: EntityOutline;
    let debuggerScene: Scene;
    let useCase: SetDebuggerEntityUseCase;
    let target: GameObject;

    beforeEach(() => {
        debuggerEntity = new EntityOutline();
        debuggerEntity2 = new EntityOutline();

        debuggerScene = engine.createScene();
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
        expect(debuggerEntity.transform.position).toEqual(target.transform.position);
        expect(debuggerEntity.transform.size).toEqual(target.transform.size);

        expect(debuggerEntity2.transform.position).toEqual(target.transform.position);
        expect(debuggerEntity2.transform.size).toEqual(target.transform.size);
    });

    it('Should not throw errors when the scene does not have a debuggerEntity', () => {
        const emptyScene = engine.createScene();
        const useCase = new SetDebuggerEntityUseCase(emptyScene);

        expect(() => {
            useCase.execute(target);
        }).not.toThrow();
    })
})