import { GameEngine, GameObject, IEntity, Scene, Vec2 } from "sparkengineweb";
import { EditorService } from "./EditorService";
import { FileSystemImageRepository } from "../assets";
import { ProjectRepository } from "../project/ports";
import { Project } from "../project/models";
import { SceneRepositoryTestDouble } from "../../__mocks__/core/scene/SceneRepositoryTestDouble";
import { WeakRef } from "../../common";


class ProjectRepositoryTestDouble implements ProjectRepository {
    public read(): Promise<Project> {
        return Promise.resolve(this.project as Project);
    }

    save = jest.fn();
    update = jest.fn();

    public project?: Project;
}

const gameEngine = new GameEngine({
    framerate: 60,
    context: new CanvasRenderingContext2D(),
    resolution: {
        width: 800,
        height: 600
    }
})
const sceneToLoad = gameEngine.createScene(true);


describe('EditorService', () => {
    let editorService: EditorService;
    let imageLoader: FileSystemImageRepository;
    let context: CanvasRenderingContext2D;
    let projectRepositoryDouble: ProjectRepositoryTestDouble;
    let sceneRepository: SceneRepositoryTestDouble;

    beforeEach(() => {
        projectRepositoryDouble = new ProjectRepositoryTestDouble();
        sceneRepository = new SceneRepositoryTestDouble();
        context = new CanvasRenderingContext2D();
        imageLoader = new FileSystemImageRepository();
        editorService = new EditorService(imageLoader, projectRepositoryDouble, sceneRepository);

        sceneRepository.save(sceneToLoad, { path: 'test-scene.spark.json', accessScope: new WeakRef<null>(null) });
    })

    describe('.start()', () => {
        it('Should create a new engine with the given configuration', () => {
            const resolution = { width: 800, height: 600 };

            editorService.start(context, resolution);

            expect(editorService.engine?.renderer.resolution).toEqual(resolution);
            expect(editorService.engine?.imageLoader).toEqual(imageLoader);
        });

        it('Should create a new scene', () => {
            const resolution = { width: 800, height: 600 };

            editorService.start(context, resolution);

            expect(editorService.currentScene).toBeDefined();
            expect(editorService.engine?.scenes).toContain(editorService.currentScene);
        });

        it('Should create a new editor scene', () => {
            const resolution = { width: 800, height: 600 };

            editorService.start(context, resolution);

            expect(editorService.editorScene).toBeDefined();
            expect(editorService.engine?.scenes).toContain(editorService.editorScene);
            expect(editorService?.editorScene?.entities).toContain(EditorService.editorEntities.originPivot);
            expect(editorService?.editorScene?.entities).toContain(EditorService.editorEntities.outline);

        });

        it('Should create a new project with the editor and game scene', () => {
            const resolution = { width: 800, height: 600 };

            editorService.start(context, resolution);

            expect(editorService.project).toBeDefined();
            expect(editorService.project?.scenes).toContain(editorService.currentScene);
            expect(editorService.project?.scenes).toContain(editorService.editorScene);
        });

        // Cannot test this yet as cannot retrieve the default wireframe thickness of the engine renderer once set
        it.todo('Should set the default wireframe thickness of the engine renderer');

        // No way to tell if engine is running
        it.todo('Should start the engine');
    });

    describe('.openProject()', () => {
        it('Should load a new project from the given repository', async () => {
            const resolution = { width: 800, height: 600 };
            projectRepositoryDouble.project = new Project({
                name: 'loaded-project',
                scenes: ['test-scene.spark.json']
            });

            editorService.start(context, resolution);
            await editorService.openProject();

            expect(editorService.project).toEqual(projectRepositoryDouble.project);
            expect(editorService.project?.scenes).toEqual([sceneToLoad])
        });

    })

    describe('.selectEntity()', () => {
        it('Should set the given entity as the current entity', () => {
            const entity = { uuid: 'test-uuid' } as IEntity;

            editorService.selectEntity(entity);

            expect(editorService.currentEntity).toEqual(entity);
        });

        it('Should draw the editor scene if the engine is already set', () => {
            const resolution = { width: 800, height: 600 };
            editorService.start(context, resolution);

            const entity = new GameObject();
            editorService.selectEntity(entity);

            expect(editorService.editorScene?.shouldDraw).toBe(true);
        })

        it.todo('Should match the editor entities to the new entity');
    });

    describe('.addNewEntity()', () => {
        it('Should register the entity into the current scene', () => {
            const resolution = { width: 800, height: 600 };
            const entity = new GameObject();

            editorService.start(context, resolution);
            editorService.addNewEntity(entity);

            expect(editorService.currentScene?.entities).toContain(entity);
        });
    });

    describe('.removeEntity()', () => {
        it('Should remove the entity from the current scene', () => {
            const resolution = { width: 800, height: 600 };
            const entity = new GameObject();

            editorService.start(context, resolution);
            editorService.addNewEntity(entity);
            editorService.removeEntity(entity.uuid);

            expect(editorService.currentScene?.entities).not.toContain(entity);
        });

        it('Should hide the editorScene', () => {
            const resolution = { width: 800, height: 600 };
            const entity = new GameObject();

            editorService.start(context, resolution);
            editorService.addNewEntity(entity);
            editorService.removeEntity(entity.uuid);

            expect(editorService.editorScene?.shouldDraw).toBe(false);
        })
    })

    describe('.updateCurrentEntitySize()', () => {
        it('Should update the size of the current entity', () => {
            const entity = new GameObject();

            editorService.selectEntity(entity);
            editorService.updateCurrentEntitySize({ width: 200, height: 200 });

            expect((editorService.currentEntity as GameObject)?.transform.size).toEqual({ width: 200, height: 200 });
        });

        it.todo('Should match the editor entities to the new size');
    });

    describe('.updateCurrentEntityPosition()', () => {
        it('Should update the position of the current entity', () => {
            const entity = new GameObject();

            editorService.selectEntity(entity);
            editorService.updateCurrentEntityPosition(new Vec2(200, 200));

            expect((editorService.currentEntity as GameObject)?.transform.position).toEqual({ x: 200, y: 200 });
        });

        it.todo('Should match the editor entities to the new position');
    });
});