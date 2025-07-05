import { ProjectRepository } from "../ports";
import testProjectJson from "../../../__mocks__/assets/test-project.json";
import { OpenProjectUseCase } from "./OpenProjectUseCase";
import { Project } from "../models";
import { SceneRepository } from "../../scene/ports";
import testSceneJson from '../../../__mocks__/assets/test-scene.json';
import { Scene } from "@sparkengine";

class MockProjectRepository implements ProjectRepository {
    read = jest.fn().mockResolvedValue(new Project(testProjectJson));
    save = jest.fn();
    update = jest.fn();
}

class MockSceneRepository implements SceneRepository {
    read = jest.fn().mockImplementation(async (): Promise<Scene> => {
        return new Promise((resolve) => {
            const scene = new Scene();
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