import { CanvasDevice, DOMImageLoader, GameObject, IEntity, Renderer, RenderSystem, Scene, Vec2 } from "sparkengineweb";
import { EditorService } from "./EditorService";
import { FileSystemImageRepository } from "../../assets";
import { ProjectRepository } from "../../project/domain";
import { Project } from "../../project/domain";
import { SceneRepositoryTestDouble } from "../../../__mocks__/core/scene/SceneRepositoryTestDouble";
import { Optional, WeakRef } from "../../common";
import { ObjectPickingService } from "../domain/ObjectPickingService";
import { ColorObjectPicker } from "../infrastructure";
import { ReactStateRepository } from "../infrastructure/adapters/ReactStateRepository";
import { StateRepository } from "./StateRepository";

class ProjectRepositoryTestDouble implements ProjectRepository {
    public read(): Promise<Project> {
        return Promise.resolve(this.project as Project);
    }

    save = jest.fn();
    update = jest.fn();

    public project?: Project;
}


class ObjectPickingServiceTestDouble extends ObjectPickingService {
    public _result?: IEntity;

    public get selectedEntity(): Optional<IEntity> {
        return this._result;
    }

    handleMouseClick = jest.fn();
    getRenderSystem = jest.fn(() => new RenderSystem(new Renderer(new CanvasDevice(), { width: 0, height: 0 }, new CanvasRenderingContext2D()), new DOMImageLoader()))
}

const sceneToLoad = new Scene();

describe('EditorService', () => {
    let editorService: EditorService;
    let imageLoader: FileSystemImageRepository;
    let context: CanvasRenderingContext2D;
    let projectRepositoryDouble: ProjectRepositoryTestDouble;
    let sceneRepository: SceneRepositoryTestDouble;
    let objectPicking: ObjectPickingServiceTestDouble;
    let appState: StateRepository;

    beforeEach(() => {
        projectRepositoryDouble = new ProjectRepositoryTestDouble();
        sceneRepository = new SceneRepositoryTestDouble();
        context = new CanvasRenderingContext2D();
        imageLoader = new FileSystemImageRepository();
        objectPicking = new ObjectPickingServiceTestDouble(new ColorObjectPicker(() => new Renderer(new CanvasDevice(), { width: 0, height: 0 }, context), { width: 0, height: 0 }, imageLoader));
        appState = new ReactStateRepository();

        editorService = new EditorService(imageLoader, imageLoader, projectRepositoryDouble, sceneRepository, objectPicking, appState);

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
        });

        it('Should draw the current scene', () => {
            const resolution = { width: 800, height: 600 };

            editorService.start(context, resolution);

            expect(editorService.currentScene?.shouldDraw).toBe(true);
        });

        it('Should create a new editor scene', () => {
            const resolution = { width: 800, height: 600 };

            editorService.start(context, resolution);

            expect(editorService.editorScene).toBeDefined();
            expect(editorService?.editorScene?.entities).toContain(EditorService.editorEntities.originPivot);
            expect(editorService?.editorScene?.entities).toContain(EditorService.editorEntities.outline);
        });

        it('Should draw the editor scene', () => {
            const resolution = { width: 800, height: 600 };

            editorService.start(context, resolution);

            expect(editorService.editorScene?.shouldDraw).toBe(true);
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

    });

    describe('.onMouseDown()', () => {
        it('Should focus on the entity at the given position if any and left mouse button', () => {
            const resolution = { width: 800, height: 600 };
            const gameObject = new GameObject();
            objectPicking._result = gameObject;

            editorService.start(context, resolution);
            editorService.handleMouseClick({
                targetX: 100,
                targetY: 100,
                button: 0
            });

            expect(editorService.currentEntity).toEqual(gameObject);
        });

        it('Should remove focus from the current entity if no entity at the given position', () => {
            const resolution = { width: 800, height: 600 };
            const gameObject = new GameObject();
            objectPicking._result = undefined;

            editorService.start(context, resolution);
            editorService.selectEntity(gameObject);
            editorService.handleMouseClick({
                targetX: 100,
                targetY: 100,
                button: 0
            });

            expect(editorService.currentEntity).not.toBeDefined();
        });

        it('Should not focus on the entity when not left mouse button', () => {
            const resolution = { width: 800, height: 600 };
            const gameObject = new GameObject();
            objectPicking._result = gameObject;

            editorService.start(context, resolution);
            editorService.handleMouseClick({
                targetX: 100,
                targetY: 100,
                button: 1
            });

            expect(editorService.currentEntity).not.toBeDefined();
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

        it('Should trigger an update on the given subscriber with the current entity', () => {
            const subscriber = jest.fn();
            appState.subscribe(subscriber)

            const resolution = { width: 800, height: 600 };

            editorService.start(context, resolution);

            const entity = new GameObject();
            editorService.selectEntity(entity);

            expect(subscriber).toHaveBeenCalledWith(expect.objectContaining({
                currentEntity: entity
            }));
        });

        it.todo('Should match the editor entities to the new entity');
    });

    describe('.addNewEntity()', () => {
        it('Should register the entity into the current scene', () => {
            const resolution = { width: 800, height: 600 };
            const entity = new GameObject();

            editorService.start(context, resolution);
            editorService.addEntity(entity);

            expect(editorService.currentScene?.entities).toContain(entity);
        });

        it('Should focus on the new entity', () => {
            const resolution = { width: 800, height: 600 };
            const entity = new GameObject();

            editorService.start(context, resolution);
            editorService.addEntity(entity);

            expect(editorService.currentEntity).toEqual(entity);
        });

        it('Should trigger an update on the given subscriber with the new entity', () => {
            const subscriber = jest.fn();
            appState.subscribe(subscriber);

            const resolution = { width: 800, height: 600 };
            const entity = new GameObject();

            editorService.start(context, resolution);
            editorService.addEntity(entity);

            expect(subscriber).toHaveBeenCalledWith(expect.objectContaining({
                currentEntity: entity,
                entities: expect.arrayContaining([entity]),
            }));
        });
    });

    describe('.removeEntity()', () => {
        it('Should remove the entity from the current scene', () => {
            const resolution = { width: 800, height: 600 };
            const entity = new GameObject();

            editorService.start(context, resolution);
            editorService.addEntity(entity);
            editorService.removeEntity(entity.uuid);

            expect(editorService.currentScene?.entities).not.toContain(entity);
        });

        it('Should deselect the currentEntity', () => {
            const resolution = { width: 800, height: 600 };
            const entity = new GameObject();

            editorService.start(context, resolution);
            editorService.addEntity(entity);
            editorService.removeEntity(entity.uuid);

            expect(editorService.currentEntity).not.toBeDefined();
        })

        it('Should hide the editorScene', () => {
            const resolution = { width: 800, height: 600 };
            const entity = new GameObject();

            editorService.start(context, resolution);
            editorService.addEntity(entity);
            editorService.removeEntity(entity.uuid);

            expect(editorService.editorScene?.shouldDraw).toBe(false);
        });

        it('Should trigger an update on the given subscriber with the new entity', () => {
            const subscriber = jest.fn();
            appState.subscribe(subscriber);

            const resolution = { width: 800, height: 600 };
            const entity = new GameObject();

            editorService.start(context, resolution);
            editorService.addEntity(entity);
            editorService.removeEntity(entity.uuid);

            expect(subscriber).toHaveBeenCalledWith(expect.objectContaining({
                currentEntity: undefined,
                entities: expect.not.arrayContaining([entity]),
            }));
        });
    })

    describe('.updateCurrentEntitySize()', () => {
        it('Should update the size of the current entity', () => {
            const entity = new GameObject();

            editorService.selectEntity(entity);
            editorService.updateCurrentEntitySize({ width: 200, height: 200 });

            expect((editorService.currentEntity as GameObject)?.transform.size).toEqual({ width: 200, height: 200 });
        });

        it('Should trigger an update on the given subscriber with the new size', () => {
            const subscriber = jest.fn();
            appState.subscribe(subscriber);

            const entity = new GameObject();

            editorService.selectEntity(entity);
            editorService.updateCurrentEntitySize({ width: 200, height: 200 });

            expect(subscriber).toHaveBeenCalledWith(expect.objectContaining({
                currentEntity: expect.objectContaining({
                    transform: expect.objectContaining({
                        size: { width: 200, height: 200 }
                    })
                })
            }));
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

        it('Should trigger an update on the given subscriber with the new position', () => {
            const subscriber = jest.fn();
            appState.subscribe(subscriber);

            const entity = new GameObject();

            editorService.selectEntity(entity);
            editorService.updateCurrentEntityPosition(new Vec2(200, 200));

            expect(subscriber).toHaveBeenCalledWith(expect.objectContaining({
                currentEntity: expect.objectContaining({
                    transform: expect.objectContaining({
                        position: { x: 200, y: 200 }
                    })
                })
            }));
        })

        it.todo('Should match the editor entities to the new position');
    });
});