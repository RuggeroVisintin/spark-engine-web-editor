import { ProjectRepository } from "../ports";
import testProjectJson from "../../../__mocks__/assets/test-project.json";
import { OpenProjectUseCase } from "./OpenProjectUseCase";
import { Project } from "../models";
import { SceneRepository } from "../../scene/ports";
import testSceneJson from '../../../__mocks__/assets/test-scene.json';
import { GameEngine } from "sparkengineweb";

class MockProjectRepository implements ProjectRepository {
    read = jest.fn().mockResolvedValue(new Project(testProjectJson));
    save = jest.fn();
}

class MockSceneRepository implements SceneRepository {
    read = jest.fn().mockResolvedValue(testSceneJson);
    save = jest.fn();
}

describe('core/project/usecases/OpenProjectUseCase', () => {
    const gameEngine = new GameEngine({
        framerate: 60,
        resolution: {
            width: 800,
            height: 600
        },
        context: new CanvasRenderingContext2D()
    });

    it('Should load the project from the chosen filesystem directory', async () => {
        const result = await new OpenProjectUseCase(new MockProjectRepository(), new MockSceneRepository()).execute();

        expect(result).toBeInstanceOf(Project);
        expect(result).toEqual({
            name: testProjectJson.name,
            scenes: testProjectJson.scenes.map(scene => {
                const result = gameEngine.createScene();
                result.loadFromJson(testSceneJson);
            }),
            scenePaths: testProjectJson.scenes
        });
    });
})