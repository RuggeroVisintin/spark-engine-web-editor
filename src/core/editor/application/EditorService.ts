import { GameEngine, IEntity, ImageLoader, Scene, TransformComponent, Vec2, Rgb, ImageAsset, MaterialComponent } from "sparkengineweb";
import { MouseClickEvent, MouseDragEvent, Optional } from "../../common";
import { Project } from "../../project/domain";
import { EntityOutline } from "../domain/entities";
import Pivot from "../domain/entities/Pivot";
import { ProjectRepository } from "../../project/domain";
import { SceneRepository } from "../../scene";
import { ObjectPickingService } from "../domain/ObjectPickingService";
import { StateRepository } from "../../common/StateRepository";
import { v4 } from 'uuid';
import { SaveProjectUseCase } from "../../project/application";
import { FileSystemImageRepository } from "../../assets/image/adapters";
import { WeakRef } from "../../common";
import { ImageRepository } from "../../assets";
import { ContextualUiService } from "../domain/ContextualUiService";
import { EditorState } from "./EditorState";

export class EditorService {
    private _currentEntity?: IEntity;
    private _currentScene?: Scene;
    private _editorScene?: Scene;
    private _engine?: GameEngine;
    private _project?: Project;

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
        private readonly imageRepository: ImageRepository,
        private readonly projectRepository: ProjectRepository,
        private readonly sceneRepository: SceneRepository,
        private readonly objectPicking: ObjectPickingService,
        private readonly stateRepository: StateRepository<EditorState>,
        private readonly contextualUiService: ContextualUiService
    ) {
        // const bc = new BroadcastChannel("scripting");

        // bc.onmessage = (event) => {
        //     console.log('Received message:', event.data);
        // };
    }

    public start(context: CanvasRenderingContext2D, resolution: { width: number, height: number }): void {
        this._engine = this.initEngine(context, resolution);

        this._project = new Project({
            name: 'my-project', scenes: []
        });

        this._currentScene = new Scene();
        this._currentScene.draw(this._engine);
        this._project.addScene(this._currentScene);

        this.initContextualUi();

        this._engine.run();
    }

    public async openProject(): Promise<void> {
        this._project = await this.projectRepository.read();
        await this._project.loadScenes(this.sceneRepository);

        (this.imageLoader as FileSystemImageRepository).changeScope(this._project.scopeRef as WeakRef<FileSystemDirectoryHandle>);

        const newScene = this._project.scenes[0];

        this._currentScene?.dispose();
        this._editorScene?.hide();

        this._engine && newScene?.draw(this._engine);

        this._currentScene = newScene;

        this.stateRepository.update({
            entities: this._currentScene?.entities || [],
            currentScene: this._currentScene,
            currentEntity: undefined
        });
    }

    public async saveProject(): Promise<void> {
        if (!this._project) return;

        this._project = await new SaveProjectUseCase(this.projectRepository, this.sceneRepository, this.imageRepository).execute(this._project);
    }

    public handleMouseClick(event: MouseClickEvent): void {
        if (event.button === 0) {
            this.objectPicking.handleMouseClick(event);

            if (this.objectPicking.selectedEntity) {
                this.selectEntity(this.objectPicking.selectedEntity);
            } else {
                this.deselectCurrentEntity();
            }
        } else if (event.button === 2) {
            const { targetX, targetY } = event;
            this.contextualUiService.moveSpawnOrigin(new Vec2(targetX, targetY));
       
            this.stateRepository.update({
                spawnPoint: this.contextualUiService.spawnPivot.position,
            });
        }
    }

    public handleMouseDrag(event: MouseDragEvent): void {
        if (event.button !== 0 || !this._currentEntity) return;

        const transform = this._currentEntity.getComponent<TransformComponent>('TransformComponent');

        if (!transform) return;

        this.updateCurrentEntityPosition(new Vec2(transform.position.x + event.deltaX, transform.position.y + event.deltaY));
    }

    public selectEntity(entity: IEntity): void {
        this._currentEntity = entity;

        this._editorScene && this.contextualUiService.focusOnEntity(entity);
        this._engine && this._editorScene?.shouldDraw === false && this._editorScene?.draw(this._engine);

        this.stateRepository.update({
            currentEntity: this._currentEntity
        });
    }

    private deselectCurrentEntity(): void {
        this._currentEntity = undefined;
        this.contextualUiService.loseFocus();

        this.stateRepository.update({
            currentEntity: undefined
        });
    }

    public addEntity(entity: IEntity): void {
        this._currentScene?.registerEntity(entity);
        this.selectEntity(entity);

        this.stateRepository.update({
            entities: this._currentScene?.entities || [],
        });
    }

    public removeEntity(uuid: string): void {
        this.deselectCurrentEntity();
        this._currentScene?.unregisterEntity(uuid);

        this.stateRepository.update({
            entities: this._currentScene?.entities || [],
        });
    }

    public updateCurrentEntitySize(newSize: { width: number, height: number }): void {
        const transform = this._currentEntity?.getComponent<TransformComponent>('TransformComponent');

        if (!transform) return;

        transform.size = newSize;

        this._editorScene && this.contextualUiService.focusOnEntity(this._currentEntity!);

        this.stateRepository.update({
            currentEntity: this._currentEntity
        });
    }

    public updateCurrentEntityPosition(newPosition: Vec2): void {
        const transform = this._currentEntity?.getComponent<TransformComponent>('TransformComponent');

        if (!transform) return;

        transform.position = newPosition;
        this._editorScene && this.contextualUiService.focusOnEntity(this._currentEntity!);

        this.stateRepository.update({
            currentEntity: this._currentEntity
        });
    }

    public updateCurrentEntityMaterial({ newDiffuseColor, newOpacity, newDiffuseTexture, removeDiffuseColor }: { 
        newDiffuseColor?: Rgb, 
        newOpacity?: number, 
        newDiffuseTexture?: ImageAsset, 
        removeDiffuseColor?: boolean 
    }): void {
        const material = this._currentEntity?.getComponent<MaterialComponent>('MaterialComponent');

        if (!material) return;

        if (newDiffuseColor) material.diffuseColor = newDiffuseColor;
        if (newOpacity) material.opacity = newOpacity;

        if (removeDiffuseColor) material.removeDiffuseColor();

        if (newDiffuseTexture) {
            material.diffuseTexturePath = `assets/${v4()}.png`;
            material.diffuseTexture = newDiffuseTexture;
        }

        this.stateRepository.update({
            currentEntity: this._currentEntity
        });
    }

    private initContextualUi(): void {
        this._editorScene = new Scene();

        this.contextualUiService.start(this._editorScene);

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
            additionalRenderSystems: () => [
                this.objectPicking.getRenderSystem()
            ]
        });

        result.renderer.defaultWireframeThickness = 3;

        return result;
    }
}