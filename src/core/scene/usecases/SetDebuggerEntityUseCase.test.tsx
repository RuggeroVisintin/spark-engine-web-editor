import { GameEngine, GameObject, Vec2 } from "sparkengineweb";
import { SetDebuggerEntityUseCase } from "./SetDebuggerEntityUseCase";

const engine = new GameEngine({
    framerate: 60,
    context: new CanvasRenderingContext2D(),
    resolution: {
        width: 800,
        height: 600
    }
})


describe('core/scene/usecases/SetDebuggerEntityUseCase', () => {
    const debuggerEntity = new GameObject();

    const target = new GameObject({
        transform: {
            position: new Vec2(15, 25),
            size: { width: 10, height: 30 }
        }
    });

    new SetDebuggerEntityUseCase().execute(target, debuggerEntity);

    it('Should match the position of the debugger entity to the one of the target', () => {
        expect(debuggerEntity.transform.position).toEqual(target.transform.position);
    });

    it('Should match the transform size of the debugger entity to the one of the target', () => {
        expect(debuggerEntity.transform.size).toEqual(target.transform.size);
    });

    it('Should register the entity in the given debuggerScene when shouldRegister is true', () => {
        const debuggerScene = engine.createScene();

        new SetDebuggerEntityUseCase(debuggerScene).execute(target, debuggerEntity, true);

        expect(debuggerScene.entities).toContain(debuggerEntity);
    })

    it('Should prevent throwing errors issue when a debuggerEntity is registered twice in a given debuggerScene', () => {
        const debuggerScene = engine.createScene();

        new SetDebuggerEntityUseCase(debuggerScene).execute(target, debuggerEntity, true);

        expect(() => {
            new SetDebuggerEntityUseCase(debuggerScene).execute(target, debuggerEntity, true);
        }).not.toThrow()
    })
})