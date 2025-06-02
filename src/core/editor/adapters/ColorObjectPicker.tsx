import { BlendMethod, CanvasDevice, DrawPrimitiveCommand, IEntity, ImageLoader, PrimitiveType, Renderer, RenderSystem, Rgb, SetBlendingMethodCommand } from "sparkengineweb";
import { uuidToRgb } from "../../common/uuidToRgb";
import { Factory, Optional } from "../../common/";
import { ObjectPicker } from "../ports/ObjectPicker";
import { EditorService } from "../EditorService";

export class ColorObjectPicker extends RenderSystem implements ObjectPicker {
    private colorToEntityMap: Map<string, IEntity> = new Map();
    private readonly context: CanvasRenderingContext2D;

    constructor(rendererFactory: Factory<typeof Renderer>, resolution: { width: number, height: number }, imageLoader: ImageLoader) {
        const canvas = document.createElement('canvas');
        canvas.width = resolution.width;
        canvas.height = resolution.height;
        const context = canvas.getContext('2d')!;

        const renderer = rendererFactory(new CanvasDevice(), resolution, context);
        super(renderer, imageLoader);

        this.context = context;
    }

    public pick(x: number, y: number): Optional<IEntity> {
        const imageData = this.context.getImageData(x, y, 1, 1);
        var r = imageData.data[0];
        var g = imageData.data[1];
        var b = imageData.data[2];

        const color = new Rgb(r, g, b);

        return this.colorToEntityMap.get(color.toHexString());
    }

    protected internalUpdate(): void {
        this.renderer.pushRenderCommand(new SetBlendingMethodCommand(BlendMethod.BM_Overwrite));

        this.camera.draw(this.renderer);

        this.components
            .sort((prevComponent, currentComponent) => currentComponent.transform.depthIndex - prevComponent.transform.depthIndex)
            .forEach(component => {
                const parentEntity = component.getContainer();

                if (!parentEntity) return;

                // avoid rendering the editor entities
                if ([EditorService.editorEntities.originPivot.uuid, EditorService.editorEntities.outline.uuid].indexOf(parentEntity.uuid) !== -1) return;

                const color = uuidToRgb(parentEntity.uuid);

                this.renderer.pushRenderCommand(new DrawPrimitiveCommand(
                    PrimitiveType.Rectangle,
                    [component.transform.position.x, component.transform.position.y],
                    [component.transform.size.width, component.transform.size.height],
                    true,
                    color.toRgbaString()
                ));

                this.colorToEntityMap.set(color.toHexString(), parentEntity);
            });
    }
}