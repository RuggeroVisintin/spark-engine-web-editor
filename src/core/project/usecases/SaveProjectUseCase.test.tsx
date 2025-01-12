import { WeakRef } from "../../../common";
import { SceneRepository } from "../../scene";
import { Project } from "../models";
import { ProjectRepository } from "../ports";
import { SaveProjectUseCase } from "./SaveProjectUseCase";
import { GameEngine } from "sparkengineweb";

const gameEngine = new GameEngine({
    framerate: 60,
    resolution: {
        width: 800,
        height: 600
    },
    context: new CanvasRenderingContext2D()
});


class MockProjectReposioty implements ProjectRepository {
    read = jest.fn();
    save = jest.fn();
};

class MockSceneRepository implements SceneRepository {
    read = jest.fn().mockResolvedValue(gameEngine.createScene());
    save = jest.fn();
}

describe('core/project/usecases/SaveProjectuseCase', () => {
    const projectRepository = new MockProjectReposioty();
    const sceneRepository = new MockSceneRepository();
    const saveProjectUseCase = new SaveProjectUseCase(projectRepository, sceneRepository);

    it('Should save the project in the given filesystem directory', async () => {
        const project = new Project({
            name: 'Test Project',
            scenes: ['scenes/test-scene.json']
        }, new WeakRef<string>('path/to/project'))

        await saveProjectUseCase.execute(project);

        expect(projectRepository.save).toHaveBeenCalledWith(project);
    });

    it('Should save the project\'s scenes in the the given filesystem directory', async () => {
        const weakRef = new WeakRef<string>('path/to/project')

        const project = new Project({
            name: 'Test Project',
            scenes: ['scenes/test-scene.json']
        }, weakRef);

        await project.loadScenes(sceneRepository);
        await saveProjectUseCase.execute(project);

        expect(sceneRepository.save).toHaveBeenCalledWith(project.scenes[0], {
            accessScope: weakRef,
            path: 'scenes/test-scene.json'
        });
    });
});