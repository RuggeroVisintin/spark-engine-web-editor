import { ProjectRepository } from "../ports";
import testProjectJson from "../../../__mocks__/assets/test-project.json";
import { OpenProjectUseCase } from "./OpenProjectUseCase";
import { Project } from "../models";
import { SceneRepository } from "../../scene/ports";
import testSceneJson from '../../../__mocks__/assets/test-scene.json';
import { GameEngine, Scene } from "sparkengineweb";

const gameEngine = new GameEngine({
    framerate: 60,
    resolution: {
        width: 800,
        height: 600
    },
    context: new CanvasRenderingContext2D()
});

class MockProjectRepository implements ProjectRepository {
    read = jest.fn().mockResolvedValue(new Project(testProjectJson));
    save = jest.fn();
}

class MockSceneRepository implements SceneRepository {
    read = jest.fn().mockImplementation(async (): Promise<Scene> => {
        return new Promise((resolve) => {
            const scene = gameEngine.createScene();
            scene.loadFromJson(testSceneJson);
            resolve(scene);
        });
    });
    save = jest.fn();
}

describe('core/project/usecases/OpenProjectUseCase', () => {


    it('Should load the project from the chosen filesystem directory', async () => {
        const result = await new OpenProjectUseCase(new MockProjectRepository(), new MockSceneRepository()).execute();

        expect(result).toBeInstanceOf(Project);

        result.scenes.forEach(scene => {
            expect(scene.toJson()).toEqual(testSceneJson)
        });
    });
})