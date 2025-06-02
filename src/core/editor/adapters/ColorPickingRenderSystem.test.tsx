import { BlendMethod, CanvasDevice, DOMImageLoader, DrawPrimitiveCommand, GameObject, PrimitiveType, RenderCommand, Renderer, SetBlendingMethodCommand, SetTransformMatrixCommand, ShapeComponent } from "sparkengineweb";
import { ColorPickingRenderSystem } from "./ColorPickingRenderSystem";
import { uuidToRgb } from "../../common/uuidToRgb";

class RendererTestDouble extends Renderer {
    public renderCommands: RenderCommand[] = [];

    public pushRenderCommand(command: RenderCommand): void {
        this.renderCommands.push(command);
    }
}

describe('core/editor/adapters/ColorPickingRenderSystem', () => {
    describe('.update()', () => {
        let renderSystem: ColorPickingRenderSystem;
        let renderer: RendererTestDouble

        beforeEach(() => {
            renderer = new RendererTestDouble(new CanvasDevice(), { width: 1920, height: 1080 }, new CanvasRenderingContext2D());
            renderSystem = new ColorPickingRenderSystem(renderer, new DOMImageLoader());

            renderer.renderCommands = [];
        });

        it('Should render objects with a diffuse color based on their parent entity uuid', () => {
            const gameObject = new GameObject();
            const gameObject2 = new GameObject();

            renderSystem.registerComponent(gameObject.shape);
            renderSystem.registerComponent(gameObject2.shape);

            renderSystem.update();

            expect(renderer.renderCommands).toStrictEqual([
                new SetBlendingMethodCommand(BlendMethod.BM_Overwrite),
                new SetTransformMatrixCommand([-0, -0]),
                new DrawPrimitiveCommand(PrimitiveType.Rectangle, [gameObject.transform.position.x, gameObject.transform.position.y], [gameObject.transform.size.width, gameObject.transform.size.height], true, uuidToRgb(gameObject.uuid).toRgbaString()),
                new DrawPrimitiveCommand(PrimitiveType.Rectangle, [gameObject2.transform.position.x, gameObject2.transform.position.y], [gameObject2.transform.size.width, gameObject2.transform.size.height], true, uuidToRgb(gameObject2.uuid).toRgbaString()),
            ]);
        });

        it('Should render objects based on their depthIndex in reverse order (0 rendered last)', () => {
            const gameObject = new GameObject();
            const gameObject2 = new GameObject();

            gameObject2.transform.depthIndex = 1;

            renderSystem.registerComponent(gameObject.shape);
            renderSystem.registerComponent(gameObject2.shape);

            renderSystem.update();

            expect(renderer.renderCommands).toStrictEqual([
                new SetBlendingMethodCommand(BlendMethod.BM_Overwrite),
                new SetTransformMatrixCommand([-0, -0]),
                new DrawPrimitiveCommand(PrimitiveType.Rectangle, [gameObject2.transform.position.x, gameObject2.transform.position.y], [gameObject2.transform.size.width, gameObject2.transform.size.height], true, uuidToRgb(gameObject2.uuid).toRgbaString()),
                new DrawPrimitiveCommand(PrimitiveType.Rectangle, [gameObject.transform.position.x, gameObject.transform.position.y], [gameObject.transform.size.width, gameObject.transform.size.height], true, uuidToRgb(gameObject.uuid).toRgbaString()),
            ]);
        });

        it('Should not render objects without a parent entity', () => {
            const component = new ShapeComponent();

            renderSystem.registerComponent(component);
            renderSystem.update();

            expect(renderer.renderCommands).toStrictEqual([
                new SetBlendingMethodCommand(BlendMethod.BM_Overwrite),
                new SetTransformMatrixCommand([-0, -0]),
            ]);
        })
    });

    describe('.pick()', () => {
        let renderSystem: ColorPickingRenderSystem;
        let renderer: RendererTestDouble

        beforeEach(() => {
            renderer = new RendererTestDouble(new CanvasDevice(), { width: 1920, height: 1080 }, new CanvasRenderingContext2D());
            renderSystem = new ColorPickingRenderSystem(renderer, new DOMImageLoader());

            renderer.renderCommands = [];
        });

        it('Should return the entity from a given color', () => {
            const gameObject = new GameObject();
            const gameObject2 = new GameObject();

            renderSystem.registerComponent(gameObject.shape);
            renderSystem.registerComponent(gameObject2.shape);

            renderSystem.update();

            const entity = renderSystem.pick(uuidToRgb(gameObject.uuid));

            expect(entity).toBe(gameObject);
        });
    })
});