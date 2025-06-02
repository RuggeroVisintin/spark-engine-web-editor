import { BlendMethod, DrawPrimitiveCommand, IEntity, PrimitiveType, RenderSystem, Rgb, SetBlendingMethodCommand } from "sparkengineweb";
import { uuidToRgb } from "../../common/uuidToRgb";

export class ColorPickingRenderSystem extends RenderSystem {
    private colorToEntityMap: Map<string, IEntity> = new Map();

    public pick(color: Rgb): IEntity | null {
        return this.colorToEntityMap.get(color.toHexString()) || null;
    }

    protected internalUpdate(): void {
        this.renderer.pushRenderCommand(new SetBlendingMethodCommand(BlendMethod.BM_Overwrite));

        this.camera.draw(this.renderer);

        this.components
            .sort((prevComponent, currentComponent) => currentComponent.transform.depthIndex - prevComponent.transform.depthIndex)
            .forEach(component => {
                const parentEntity = component.getContainer();

                if (!parentEntity) return;

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