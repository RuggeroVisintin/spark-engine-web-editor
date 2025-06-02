import React, { useRef, useState } from 'react';
import { CanvasDevice, GameEngine, IEntity, ImageAsset, ImageLoader, MaterialComponent, Renderer, Rgb, Scene, TransformComponent, Vec2 } from '@sparkengine';
import { EngineView } from '../../components';
import { Box, FlexBox } from '../../primitives';
import { EntityFactoryPanel, ScenePanel } from '../../templates';
import { ActionMenu } from '../../templates/ActionMenu';
import { EntityPropsPanel } from '../../templates/EntityPropsPanel';
import { FileSystemSceneRepository } from '../../core/scene/adapters';
import { FileSystemProjectRepository } from '../../core/project/adapters';
import { SaveProjectUseCase } from '../../core/project/usecases';
import { Project } from '../../core/project/models';
import { MouseClickEvent, MouseDragEvent, OnEngineViewReadyCBProps } from '../../components/EngineView';
import { FileSystemImageRepository } from '../../core/assets/image/adapters';
import { WeakRef } from '../../core/common';
import { ImageRepository } from '../../core/assets';
import { v4 } from 'uuid';
import { EditorService } from '../../core/editor';
import { ColorObjectPicker } from '../../core/editor/adapters/ColorObjectPicker';
import { ObjectPickingService } from '../../core/editor/ObjectPickingService';

let imageRepository: ImageRepository;
let imageLoader: ImageLoader;

const project = new Project({ name: 'my-project', scenes: [] });
const projectRepo = new FileSystemProjectRepository();
const sceneRepo = new FileSystemSceneRepository();

imageLoader = imageRepository = new FileSystemImageRepository(project.scopeRef as WeakRef<FileSystemDirectoryHandle>);
const objectPikcer = new ColorObjectPicker((...params) => new Renderer(...params), { width: 1920, height: 1080 }, imageLoader);
const objectPickingService = new ObjectPickingService(objectPikcer);

const editorService = new EditorService(imageLoader, projectRepo, sceneRepo, objectPickingService);

export const EditorLayout = () => {
    const [currentProject, setCurrentProject] = useState<Project>(project);
    const [spawnPoint, setSpawnPoint] = useState<Vec2>(new Vec2(55, 55));
    const [scene, setScene] = useState<Scene>();
    const [debuggerScene, setDebuggerScene] = useState<Scene>();
    const [entities, setEntities] = useState<IEntity[]>([]);
    const [currentEntity, setCurrentEntity] = useState<IEntity | undefined>(undefined);
    const engine = useRef<GameEngine>();

    const onEngineViewReady = async ({ context, resolution }: OnEngineViewReadyCBProps) => {
        editorService.start(context, resolution);
        const newEngine = editorService.engine!;

        editorService.currentScene && setScene(editorService.currentScene);
        editorService.editorScene && setDebuggerScene(editorService.editorScene);
        editorService.project && setCurrentProject(editorService.project);

        engine.current = newEngine;
    };

    const onAddEntity = (entity: IEntity) => {
        editorService.addNewEntity(entity);
        setEntities([...editorService.currentScene?.entities ?? []]);
        onEntityFocus(entity);
    };

    const onRemoveEntity = (entity: IEntity) => {
        editorService.removeEntity(entity.uuid);
        setEntities([...editorService.currentScene?.entities ?? []]);
        setCurrentEntity(undefined);
    };

    const onMaterialUpdate = ({ newDiffuseColor, newOpacity, newDiffuseTexture, removeDiffuseColor }: { newDiffuseColor: Rgb, newOpacity: number, newDiffuseTexture: ImageAsset, removeDiffuseColor: boolean }) => {
        const material = editorService.currentEntity?.getComponent<MaterialComponent>('MaterialComponent');

        if (!material) return;

        if (newDiffuseColor) material.diffuseColor = newDiffuseColor;
        if (newOpacity) material.opacity = newOpacity;

        if (removeDiffuseColor) material.removeDiffuseColor();

        if (newDiffuseTexture) {
            material.diffuseTexturePath = `assets/${v4()}.png`;
            material.diffuseTexture = newDiffuseTexture;
        }
    }

    const onEntityFocus = (target: IEntity) => {
        editorService.selectEntity(target);
        editorService.currentEntity && setCurrentEntity(editorService.currentEntity);
    }

    const onProjectFileOpen = async () => {
        if (!sceneRepo) return;

        const newProject = await editorService.openProject();

        (imageLoader as FileSystemImageRepository).changeScope(newProject.scopeRef as WeakRef<FileSystemDirectoryHandle>);

        const newScene = newProject.scenes[0];

        scene?.dispose();
        debuggerScene?.hide();

        editorService.engine && newScene?.draw(editorService.engine);

        setScene(newScene);
        setCurrentProject(newProject);
        setEntities([...newScene?.entities || []]);
    };

    const onProjectFileSave = async () => {
        if (!currentProject) return;

        setCurrentProject(await new SaveProjectUseCase(projectRepo, sceneRepo, imageRepository).execute(currentProject));
    };

    const onEngineViewClick = (e: MouseClickEvent) => {
        console.log('onEngineViewClick', e);
        if (e.button === 2) {
            const { targetX, targetY } = e;

            EditorService.editorEntities.originPivot.transform.position = new Vec2(targetX, targetY);

            setSpawnPoint(EditorService.editorEntities.originPivot.transform.position);
        }

        objectPickingService.handleMouseClick(e, onEntityFocus);
    }

    const onEngineViewMouseDragging = (e: MouseDragEvent) => {
        console.log('onEngineViewMouseDragging', e);

        if (!editorService.currentEntity) return;

        const transform = editorService.currentEntity.getComponent<TransformComponent>('TransformComponent');

        if (!transform) return;

        editorService.updateCurrentEntityPosition(new Vec2(transform.position.x + e.deltaX, transform.position.y + e.deltaY));
    };

    return (
        <FlexBox $fill={true}>
            <ActionMenu onProjectFileOpen={onProjectFileOpen} onProjectFileSave={onProjectFileSave}></ActionMenu>
            <FlexBox $direction='row' $fill style={{ overflow: 'hidden' }}>
                <EntityFactoryPanel onAddEntity={onAddEntity} spawnPoint={spawnPoint}></EntityFactoryPanel>
                <EngineView onEngineViewReady={onEngineViewReady} onClick={onEngineViewClick} onMouseDragging={onEngineViewMouseDragging}></EngineView>
                <Box $size={0.25}>
                    <FlexBox $fill={true}>
                        <ScenePanel
                            entities={entities}
                            onRemoveEntity={onRemoveEntity}
                            onFocusEntity={onEntityFocus}
                            currentEntity={currentEntity}
                        ></ScenePanel>
                        {currentEntity &&
                            <EntityPropsPanel
                                entity={currentEntity}
                                onUpdatePosition={({ newPosition }: { newPosition: Vec2 }) => editorService.updateCurrentEntityPosition(newPosition)}
                                onUpdateSize={({ newSize }: { newSize: { width: number, height: number } }) => editorService.updateCurrentEntitySize(newSize)}
                                onMaterialUpdate={onMaterialUpdate}
                            ></EntityPropsPanel>}
                    </FlexBox>
                </Box>
            </FlexBox>
            <FlexBox style={{ height: '33%' }}>
                <Box style={{ backgroundColor: 'grey' }}></Box>
            </FlexBox>
        </FlexBox>
    )
}