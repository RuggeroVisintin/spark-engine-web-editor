import { GameEngine, IEntity, ImageLoader, Scene, TransformComponent } from "sparkengineweb";
import { SetDebuggerEntityUseCase } from "../debug/usecases";
import { Optional } from "../../common";
import { Project } from "../project/models";
import { EntityOutline } from "../debug";
import Pivot from "../debug/Pivot";

export class EditorService {
    private _currentEntity?: IEntity;
    private _currentScene?: Scene;
    private _editorScene?: Scene;
    private _engine?: GameEngine;
    private _project?: Project;

    public static editorEntities = {
        outline: new EntityOutline(),
        originPivot: new Pivot()
    }

    public get currentEntity(): Optional<IEntity> {
        return this._currentEntity;
    }

    public get currentScene(): Optional<Scene> {
        return this._currentScene;
    }

    public get editorScene(): Optional<Scene> {
        return this._editorScene;
    }

    public get engine(): Optional<GameEngine> {
        return this._engine;
    }

    public get project(): Optional<Project> {
        return this._project;
    }

    constructor(
        private readonly imageLoader: ImageLoader,
    ) {
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

        this._project = new Project({
            name: 'my-project', scenes: []
        });


        this._engine.renderer.defaultWireframeThickness = 3;

        this._currentScene = this._engine.createScene(true);
        this._project.addScene(this._currentScene);

        this.initEditorScene();

        this._engine.run();
    }

    public selectEntity(entity: IEntity): void {
        this._currentEntity = entity;
    }

    public addNewEntity(entity: IEntity): void {
        this._currentScene?.registerEntity(entity);
    }

    public updateCurrentEntitySize(newSize: { width: number, height: number }): void {
        const transform = this._currentEntity?.getComponent<TransformComponent>('TransformComponent');

        if (!transform) return;

        transform.size = newSize;

        this._editorScene && new SetDebuggerEntityUseCase(this._editorScene).execute(this._currentEntity!);
    }

    private initEditorScene(): void {
        this._editorScene = this._engine!.createScene(true);
        this._editorScene.registerEntity(EditorService.editorEntities.outline);
        this._editorScene.registerEntity(EditorService.editorEntities.originPivot);
        this._project!.addScene(this._editorScene);
    }
}