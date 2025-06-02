import { CanvasDevice, ImageLoader, Renderer } from "sparkengineweb";
import { Optional } from "../../common";

export class ObjectPickingService {
    private _renderer?: Renderer;

    public get renderer(): Optional<Renderer> {
        return this._renderer;
    }

    public start(context: CanvasRenderingContext2D, resolution: { width: number, height: number }): void {
        this._renderer = new Renderer(
            new CanvasDevice(),
            resolution,
            context,
        );
    }
}