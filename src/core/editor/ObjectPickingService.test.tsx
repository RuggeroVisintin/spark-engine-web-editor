import { Renderer } from "sparkengineweb";
import { ObjectPickingService } from "./ObjectPickingService";

describe('core/editor/ObjectPickingService', () => {
    describe('.start()', () => {
        it('Should create a new Renderer with the given configuration', () => {
            const resolution = { width: 800, height: 600 };
            const context = new CanvasRenderingContext2D();

            const colorPickerService = new ObjectPickingService();

            colorPickerService.start(context, resolution);

            expect(colorPickerService.renderer).toBeInstanceOf(Renderer);
        });

        it('Should create a ColorPicking')
    });
});