import { GameEngine } from "sparkengineweb";
import { LoadSceneUseCase } from "./LoadSceneUseCase";
import testSceneJson from '../../../__mocks__/assets/test-scene.json';
import { SceneRepository } from "../ports";

const engine = new GameEngine({
    framerate: 60,
    context: new CanvasRenderingContext2D(),
    resolution: {
        width: 800,
        height: 600
    }
})


class MockSceneRepository implements SceneRepository {
    read = jest.fn().mockImplementation(() => {
        const result = engine.createScene();
        result.loadFromJson(testSceneJson);

        return result;
    });
    save = jest.fn();
}

describe('core/scene/usecases/LoadSceneUseCase', () => {
    it('Should return the loaded scene', async () => {
        const loadedScene = await new LoadSceneUseCase(new MockSceneRepository())
            .execute();

        const groundTruthScene = engine.createScene();
        groundTruthScene.loadFromJson(testSceneJson);

        expect(groundTruthScene.toJson()).toEqual(loadedScene.toJson());
    })
})