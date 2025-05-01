import { GameEngine, GameObject, IEntity } from "sparkengineweb";
import { EditorService } from "./EditorService";
import { FileSystemImageRepository } from "../assets";

describe('EditorService', () => {
    let editorService: EditorService;

    beforeEach(() => {
        editorService = new EditorService(new FileSystemImageRepository());
    })

    describe('.start()', () => {
        it('Should start the editor by creating a new engine', () => {
            const context = new CanvasRenderingContext2D();
            const resolution = { width: 800, height: 600 };

            editorService.start(context, resolution);

            expect(editorService.engine?.renderer.resolution).toEqual(resolution);
        });
    });

    describe('.focusEntity()', () => {
        it('Should set the given entity as the current entity', () => {
            const entity = { uuid: 'test-uuid' } as IEntity;

            editorService.focusOnEntity(entity);

            expect(editorService.currentEntity).toEqual(entity);
        });
    })

    describe('.updateCurrentEntitySize()', () => {
        it('Should update the size of the current entity', () => {
            const entity = new GameObject();

            editorService.focusOnEntity(entity);
            editorService.updateCurrentEntitySize({ width: 200, height: 200 });

            expect((editorService.currentEntity as GameObject)?.transform.size).toEqual({ width: 200, height: 200 });
        });
    })
});