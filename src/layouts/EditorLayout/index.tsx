import React, { useRef } from 'react';
import { GameEngine, IEntity, ImageLoader, MaterialComponent, Renderer, TransformComponent, Vec2 } from '@sparkengine';
import { EngineView } from '../../components';
import { Box, FlexBox } from '../../primitives';
import { EntityFactoryPanel, ScenePanel } from '../../templates';
import { ActionMenu } from '../../templates/ActionMenu';
import { EntityPropsPanel } from '../../templates/EntityPropsPanel';
import { FileSystemSceneRepository } from '../../core/scene/infrastructure/adapters';
import { FileSystemProjectRepository } from '../../core/project/infrastructure/adapters';
import { Project } from '../../core/project/domain';
import { OnEngineViewReadyCBProps } from '../../components/EngineView';
import { FileSystemImageRepository } from '../../core/assets/image/adapters';
import { WeakRef } from '../../core/common';
import { ImageRepository } from '../../core/assets';
import { EditorService } from '../../core/editor/application';
import { ColorObjectPicker } from '../../core/editor';
import { ObjectPickingService } from '../../core/editor/domain/ObjectPickingService';
import { ReactStateRepository } from '../../core/editor/infrastructure/adapters/ReactStateRepository';
import { useEditorState } from '../../hooks';

let imageRepository: ImageRepository;
let imageLoader: ImageLoader;

const project = new Project({ name: 'my-project', scenes: [] });
const projectRepo = new FileSystemProjectRepository();
const sceneRepo = new FileSystemSceneRepository();

imageLoader = imageRepository = new FileSystemImageRepository(project.scopeRef as WeakRef<FileSystemDirectoryHandle>);
const objectPikcer = new ColorObjectPicker((...params) => new Renderer(...params), { width: 1920, height: 1080 }, imageLoader);
const objectPickingService = new ObjectPickingService(objectPikcer);

const appState = new ReactStateRepository();
const editorService = new EditorService(imageLoader, imageRepository, projectRepo, sceneRepo, objectPickingService, appState);

export const EditorLayout = () => {
    const engine = useRef<GameEngine>();
    const [editorState] = useEditorState(appState);

    const onEngineViewReady = async ({ context, resolution }: OnEngineViewReadyCBProps) => {
        editorService.start(context, resolution);
        const newEngine = editorService.engine!;

        engine.current = newEngine;
    };

    return (
        <FlexBox $fill={true}>
            <ActionMenu
                onProjectFileOpen={() => editorService.openProject()}
                onProjectFileSave={() => editorService.saveProject()}
            />
            <FlexBox $direction='row' $fill style={{ overflow: 'hidden' }}>
                <EntityFactoryPanel
                    onAddEntity={(entity: IEntity) => editorService.addEntity(entity)}
                    spawnPoint={editorState.spawnPoint}
                />
                <EngineView
                    onEngineViewReady={onEngineViewReady}
                    onClick={(e) => editorService.handleMouseClick(e)}
                    onMouseDown={(e) => editorService.handleMouseClick(e)}
                    onMouseDragging={(e) => editorService.handleMouseDrag(e)}
                />
                <Box $size={0.25}>
                    <FlexBox $fill={true}>
                        <ScenePanel
                            entities={editorState.entities}
                            onRemoveEntity={({ uuid }: IEntity) => editorService.removeEntity(uuid)}
                            onFocusEntity={(entity: IEntity) => editorService.selectEntity(entity)}
                            currentEntity={editorState.currentEntity}
                        ></ScenePanel>
                        {editorState.currentEntity &&
                            <EntityPropsPanel
                                material={editorState.currentEntity.getComponent<MaterialComponent>('MaterialComponent')}
                                transform={editorState.currentEntity?.getComponent<TransformComponent>('TransformComponent')}
                                onUpdatePosition={({ newPosition }: { newPosition: Vec2 }) => editorService.updateCurrentEntityPosition(newPosition)}
                                onUpdateSize={({ newSize }: { newSize: { width: number, height: number } }) => editorService.updateCurrentEntitySize(newSize)}
                                onMaterialUpdate={(materialProps: any) => editorService.updateCurrentEntityMaterial(materialProps)}
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