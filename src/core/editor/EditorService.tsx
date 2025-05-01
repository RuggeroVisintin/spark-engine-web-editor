import { GameEngine, IEntity, ImageLoader, Scene, TransformComponent } from "sparkengineweb";
import { SetDebuggerEntityUseCase } from "../debug/usecases";
import { Optional } from "../../common";

export class EditorService {
    private _currentEntity?: IEntity;
    private _currentScene?: Scene;
    private _currentDebuggingScene?: Scene;
    private _engine?: GameEngine;

    constructor(
        private readonly imageLoader: ImageLoader,
    ) {
    }

    public get currentEntity(): Optional<IEntity> {
        return this._currentEntity;
    }

    public get currentScene(): Optional<Scene> {
        return this._currentScene;
    }

    public get engine(): Optional<GameEngine> {
        return this._engine;
    }

    public start(context: CanvasRenderingContext2D, resolution: { width: number, height: number }): void {
        this._engine = new GameEngine({
            framerate: 60,
            context: context,
            resolution: {
                width: resolution.width,
                height: resolution.height
            },
            imageLoader: this.imageLoader
        });

        this._engine.renderer.defaultWireframeThickness = 3;
    }

    public focusOnEntity(entity: IEntity): void {
        this._currentEntity = entity;
    }

    public updateCurrentEntitySize(newSize: { width: number, height: number }): void {
        const transform = this._currentEntity?.getComponent<TransformComponent>('TransformComponent');

        if (!transform) return;

        transform.size = newSize;

        this._currentDebuggingScene && new SetDebuggerEntityUseCase(this._currentDebuggingScene).execute(this._currentEntity!);
    }
}