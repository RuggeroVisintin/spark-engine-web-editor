import { GameEngine, GameObject, IEntity } from "sparkengineweb";
import { EditorService } from "./EditorService";
import { FileSystemImageRepository } from "../assets";

describe('EditorService', () => {
    let editorService: EditorService;
    let imageLoader: FileSystemImageRepository;
    let context: CanvasRenderingContext2D;

    beforeEach(() => {
        context = new CanvasRenderingContext2D();
        imageLoader = new FileSystemImageRepository();
        editorService = new EditorService(imageLoader);
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

    describe('.selectEntity()', () => {
        it('Should set the given entity as the current entity', () => {
            const entity = { uuid: 'test-uuid' } as IEntity;

            editorService.selectEntity(entity);

            expect(editorService.currentEntity).toEqual(entity);
        });
    });

    describe('.addNewEntity()', () => {
        it('Should register the entity into the current scene', () => {
            const resolution = { width: 800, height: 600 };
            const entity = new GameObject();

            editorService.start(context, resolution);
            editorService.addNewEntity(entity);

            expect(editorService.currentScene?.entities).toContain(entity);
        })
    })

    describe('.updateCurrentEntitySize()', () => {
        it('Should update the size of the current entity', () => {
            const entity = new GameObject();

            editorService.selectEntity(entity);
            editorService.updateCurrentEntitySize({ width: 200, height: 200 });

            expect((editorService.currentEntity as GameObject)?.transform.size).toEqual({ width: 200, height: 200 });
        });
    });
});