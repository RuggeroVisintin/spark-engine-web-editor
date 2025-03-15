import { GameEngine, GameEngineOptions } from "sparkengineweb";

interface NewEngineCommand {
    width: number;
    height: number;
    context: CanvasRenderingContext2D;
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
            }
        });

        newEngine.renderer.defaultWireframeThickness = 3;

        return newEngine;
    }
}