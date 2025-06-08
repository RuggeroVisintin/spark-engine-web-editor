import { GameEngine, IEntity, ImageLoader, Renderer, Scene, TransformComponent, Vec2 } from "sparkengineweb";
import { SetDebuggerEntityUseCase } from "../debug/usecases";
import { Function, MouseClickEvent, Optional } from "../common";
import { Project } from "../project/models";
import { EntityOutline } from "../debug";
import Pivot from "../debug/Pivot";
import { ProjectRepository } from "../project/ports";
import { SceneRepository } from "../scene";
import { ObjectPickingService } from "./ObjectPickingService";

// TOOD: split into multiple services once refactoring is finished
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
        private readonly projectRepository: ProjectRepository,
        private readonly sceneRepository: SceneRepository,
        private readonly objectPicking: ObjectPickingService
    ) {
    }

    public start(context: CanvasRenderingContext2D, resolution: { width: number, height: number }): void {
        this._engine = this.initEngine(context, resolution);

        this._project = new Project({
            name: 'my-project', scenes: []
        });

        this._currentScene = new Scene();
        this._currentScene.draw(this._engine);
        this._project.addScene(this._currentScene);

        this.initEditorScene();

        this._engine.run();
    }

    public async openProject(): Promise<Project> {
        this._project = await this.projectRepository.read();

        await this._project.loadScenes(this.sceneRepository);

        return this._project;
    }

    public onMouseDown(event: MouseClickEvent): void {
        if (event.button === 0) {
            this.objectPicking.handleMouseClick(event);

            if (this.objectPicking.selectedEntity) {
                this.selectEntity(this.objectPicking.selectedEntity);
            } else {
                this.deselectCurrentEntity()
            }
        }
    }

    public selectEntity(entity: IEntity): void {
        this._currentEntity = entity;

        this.editorScene && new SetDebuggerEntityUseCase(this.editorScene).execute(this._currentEntity);
        this.engine && this.editorScene?.shouldDraw === false && this.editorScene?.draw(this.engine);
    }

    private deselectCurrentEntity(): void {
        this._currentEntity = undefined;
        this._editorScene?.hide();
    }

    public addNewEntity(entity: IEntity): void {
        this._currentScene?.registerEntity(entity);
    }

    public removeEntity(id: string): void {
        this.deselectCurrentEntity();
        this._currentScene?.unregisterEntity(id);
    }

    public updateCurrentEntitySize(newSize: { width: number, height: number }): void {
        const transform = this._currentEntity?.getComponent<TransformComponent>('TransformComponent');

        if (!transform) return;

        transform.size = newSize;

        this._editorScene && new SetDebuggerEntityUseCase(this._editorScene).execute(this._currentEntity!);
    }

    public updateCurrentEntityPosition(newPosition: Vec2): void {
        const transform = this._currentEntity?.getComponent<TransformComponent>('TransformComponent');

        if (!transform) return;

        transform.position = newPosition;
        this._editorScene && new SetDebuggerEntityUseCase(this._editorScene).execute(this._currentEntity!);
    }

    private initEditorScene(): void {
        this._editorScene = new Scene();
        this._editorScene.registerEntity(EditorService.editorEntities.outline);
        this._editorScene.registerEntity(EditorService.editorEntities.originPivot);
        this._project!.addScene(this._editorScene);

        this._editorScene.draw(this._engine!);
    }

    private initEngine(context: CanvasRenderingContext2D, resolution: { width: number, height: number }): GameEngine {
        const result = new GameEngine({
            framerate: 60,
            context: context,
            resolution: {
                width: resolution.width,
                height: resolution.height
            },
            imageLoader: this.imageLoader,
            additionalRenderSystems: (renderer: Renderer, imageLoader: ImageLoader) => [
                this.objectPicking.getRenderSystem()
            ]
        });

        result.renderer.defaultWireframeThickness = 3;

        return result;
    }
}