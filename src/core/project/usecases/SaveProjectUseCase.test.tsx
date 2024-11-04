import { WeakRef } from "../../../common";
import { Project } from "../models";
import { ProjectRepository } from "../ports";
import { SaveProjectUseCase } from "./SaveProjectUseCase"

class MockProjectReposioty implements ProjectRepository {
    read = jest.fn();
    save = jest.fn();
}


describe('core/project/usecases/SaveProjectuseCase', () => {
    const projectRepository = new MockProjectReposioty();
    const saveProjectUseCase = new SaveProjectUseCase(projectRepository);

    it('Should save the project in the given filesystem directory', async () => {
        const project = new Project({
            name: 'Test Project',
            scenes: ['scenes/test-scene.json']
        }, new WeakRef<string>('path/to/project'))

        await saveProjectUseCase.execute(project);

        expect(projectRepository.save).toHaveBeenCalledWith(project);
    })
})