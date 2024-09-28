import { ProjectRepository } from "../ports";
import testProjectJson from "../../../__mocks__/assets/test-project.json";
import { OpenProjectUseCase } from "./OpenProjectUseCase";
import { Project } from "../models";

class MockSceneRepository implements ProjectRepository {
    read = jest.fn().mockResolvedValue(new Project(testProjectJson));
    save = jest.fn();
}

describe('core/project/usecases/OpenProjectUseCase', () => {
    it('Should load the project from the chosen filesystem directory', async () => {
        const result = await new OpenProjectUseCase(new MockSceneRepository()).execute();

        expect(result).toBeInstanceOf(Project);
        expect(result).toEqual({
            name: testProjectJson.name,
            scenes: testProjectJson.scenes
        });
    });
})