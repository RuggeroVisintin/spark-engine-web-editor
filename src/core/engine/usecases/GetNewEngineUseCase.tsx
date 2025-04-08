import { GameEngine, ImageLoader } from "@sparkengine";

interface NewEngineCommand {
    width: number;
    height: number;
    context: CanvasRenderingContext2D;
    imageLoader?: ImageLoader;
}

export class GetNewEngineUseCase {
    constructor() { }

    async execute(command: NewEngineCommand): Promise<GameEngine> {
        const newEngine = new GameEngine({
            framerate: 60,
            context: command.context,
            resolution: {
                width: command.width,
                height: command.height
            },
            imageLoader: command.imageLoader
        });

        newEngine.renderer.defaultWireframeThickness = 3;

        return newEngine;
    }
}