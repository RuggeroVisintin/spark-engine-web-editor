import { GameObject, Scene, Vec2 } from "sparkengineweb";
import { ContextualUiService } from "./ContextualUiService";

describe('core/editor/ContextualUiService', () => {
    let service: ContextualUiService;
    let contextualUiScene: Scene;

    beforeAll(() => {
        contextualUiScene = new Scene();
        service = new ContextualUiService();

        service.start(contextualUiScene);
    });

    describe('.start()', () => {
        it('Should initialize the given scene with contextual UI elements', () => {
            expect(contextualUiScene.entities).toEqual(expect.arrayContaining([
                service.currentEntityOriginPivot,
                service.currentEntityOutline,
                service.spawnPivot
            ]));
        });
    });

    describe('.moveSpawnPoint()', () => {
        it('Should move the spawn pivot to the given position', () => {
            const service = new ContextualUiService();
            const position = new Vec2(100, 200);

            service.moveSpawnOrigin(position);

            expect(service.spawnPivot.position).toEqual(position);
        });
    });

    describe('.focusOnEntity()', () => {
        it('Should move the current entity origin pivot to the entity position', () => {
            const entity = new GameObject();

            service.focusOnEntity(entity);

            expect(service.currentEntityOriginPivot.position).toEqual(entity.transform.position);
        });

        it('Should move the entity outline to the entity position shape and size', () => {
            const entity = new GameObject();
            entity.transform.size.height = 50;
            entity.transform.size.width = 100;

            service.focusOnEntity(entity);

            expect(service.currentEntityOutline.transform.position).toEqual(entity.transform.position);
            expect(service.currentEntityOutline.transform.size).toEqual(entity.transform.size);
        });

        it('Should make the current entity origin pivot visible', () => {
            const entity = new GameObject();
            entity.transform.size.height = 50;
            entity.transform.size.width = 100;

            service.focusOnEntity(entity);

            expect(service.currentEntityOriginPivot.transform.size).toEqual({ width: 10, height: 10 });
        });
    })

    describe('.loseFocus()', () => {
        beforeAll(() => {
            const entity = new GameObject();
            entity.transform.size.height = 50;
            entity.transform.size.width = 100;

            service.focusOnEntity(entity);
        })

        it('Should hide the current entity origin pivot', () => {
            service.loseFocus();

            expect(service.currentEntityOriginPivot.transform.size).toEqual({ width: 0, height: 0 });
        });

        it('Should hide the entity outline', () => {
            service.loseFocus();

            expect(service.currentEntityOutline.transform.size).toEqual({ width: 0, height: 0 });
        });
    })
});