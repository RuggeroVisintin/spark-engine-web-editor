import { GameEngine } from "@sparkengine";
import testSceneJson from '../../../__mocks__/assets/test-scene.json';
import { SceneRepository } from "../ports";
import { SaveSceneUseCase } from "./SaveSceneUseCase";

const engine = new GameEngine({
    framerate: 60,
    context: new CanvasRenderingContext2D(),
    resolution: {
        width: 800,
        height: 600
    }
})

class MockSceneRepository implements SceneRepository {
    read = jest.fn().mockResolvedValue(testSceneJson);
    save = jest.fn();
}

describe('core/scene/usecases/SaveSceneUseCase', () => {
    it('Should save the given scene json props in the scene repository', async () => {
        const sceneToSave = engine.createScene();
        const mockRepo = new MockSceneRepository();

        await new SaveSceneUseCase(mockRepo)
            .execute(sceneToSave);

        expect(mockRepo.save).toHaveBeenCalledWith(sceneToSave);
    })
})