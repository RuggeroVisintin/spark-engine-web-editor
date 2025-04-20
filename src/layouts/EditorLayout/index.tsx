import React, { useCallback, useRef, useState } from 'react';
import { GameEngine, IEntity, ImageAsset, ImageLoader, MaterialComponent, Rgb, Scene, TransformComponent, Vec2 } from '@sparkengine';
import { EngineView } from '../../components';
import { Box, FlexBox } from '../../primitives';
import { EntityFactoryPanel, ScenePanel } from '../../templates';
import { ActionMenu } from '../../templates/ActionMenu';
import { EntityPropsPanel } from '../../templates/EntityPropsPanel';
import { SceneRepository } from '../../core/scene/ports';
import { FileSystemSceneRepository } from '../../core/scene/adapters';
import { OpenProjectUseCase } from '../../core/project/usecases/OpenProjectUseCase';
import { ProjectRepository } from '../../core/project/ports';
import { FileSystemProjectRepository } from '../../core/project/adapters';
import { SaveProjectUseCase } from '../../core/project/usecases';
import { GetNewEngineUseCase } from '../../core/engine/usecases';
import { Project } from '../../core/project/models';
import { OnEngineReadyCBProps } from '../../components/EngineView';
import { FileSystemImageRepository } from '../../core/assets/image/adapters';
import { WeakRef } from '../../common';
import { ImageRepository } from '../../core/assets';
import { v4 } from 'uuid';
import { EntityOutline } from '../../core/debug';
import Pivot from '../../core/debug/Pivot';
import { SetDebuggerEntityUseCase } from '../../core/debug/usecases';

const debugEntities = {
    outline: new EntityOutline(),
    originPivot: new Pivot()
}

let sceneRepo: SceneRepository;
let projectRepo: ProjectRepository;
let imageRepository: ImageRepository;
let imageLoader: ImageLoader;

const project = new Project({ name: 'my-project', scenes: [] });
imageLoader = imageRepository = new FileSystemImageRepository(project.scopeRef as WeakRef<FileSystemDirectoryHandle>);

export const EditorLayout = () => {
    const [currentProject, setCurrentProject] = useState<Project>(project);
    const [scene, setScene] = useState<Scene>();
    const [debuggerScene, setDebuggerScene] = useState<Scene>();
    const [entities, setEntities] = useState<IEntity[]>([]);
    const [currentEntity, setCurrentEntity] = useState<IEntity | undefined>(undefined);
    const engine = useRef<GameEngine>();

    const onEngineReady = async ({ context, resolution }: OnEngineReadyCBProps) => {
        const newEngine = await new GetNewEngineUseCase().execute({
            width: resolution.width,
            height: resolution.height,
            imageLoader,
            context
        });

        sceneRepo = new FileSystemSceneRepository(newEngine);
        projectRepo = new FileSystemProjectRepository();

        const scene = newEngine.createScene(true);
        const debuggerScene = newEngine.createScene(true);

        debuggerScene.registerEntity(debugEntities.outline);
        debuggerScene.registerEntity(debugEntities.originPivot);

        currentProject.addScene(scene);

        setScene(scene);
        setDebuggerScene(debuggerScene);

        newEngine.run();

        engine.current = newEngine;
    };

    const onAddEntity = useCallback((entity: IEntity) => {
        if (!scene) return;

        scene.registerEntity(entity);
        setEntities([...scene.entities ?? []]);
    }, [scene]);

    const onRemoveEntity = useCallback((entity: IEntity) => {
        if (!scene || !debuggerScene) return;

        scene.unregisterEntity(entity.uuid);
        debuggerScene.hide();
        setEntities([...scene.entities ?? []]);
        setCurrentEntity(undefined);
    }, [scene, debuggerScene]);

    const onPositionUpdate = ({ newPosition }: { newPosition: Vec2 }) => {
        const transform = currentEntity?.getComponent<TransformComponent>('TransformComponent');
        if (!transform || !debuggerScene || !currentEntity) return;

        transform.position = newPosition;
        new SetDebuggerEntityUseCase(debuggerScene).execute(currentEntity);
    }

    const onSizeUpdate = ({ newSize }: { newSize: { width: number, height: number } }) => {
        const transform = currentEntity?.getComponent<TransformComponent>('TransformComponent');
        if (!transform || !debuggerScene || !currentEntity) return;

        transform.size = newSize;
        new SetDebuggerEntityUseCase(debuggerScene).execute(currentEntity);
    }

    const onMaterialUpdate = ({ newDiffuseColor, newOpacity, newDiffuseTexture, removeDiffuseColor }: { newDiffuseColor: Rgb, newOpacity: number, newDiffuseTexture: ImageAsset, removeDiffuseColor: boolean }) => {
        const material = currentEntity?.getComponent<MaterialComponent>('MaterialComponent');

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
        setCurrentEntity(target);

        if (!debuggerScene) return;

        debuggerScene.draw()

        new SetDebuggerEntityUseCase(debuggerScene).execute(target);
    }

    const onProjectFileOpen = async () => {
        if (!sceneRepo) return;

        const newProject = await new OpenProjectUseCase(projectRepo, sceneRepo)
            .execute();

        (imageLoader as FileSystemImageRepository).changeScope(newProject.scopeRef as WeakRef<FileSystemDirectoryHandle>);

        const newScene = newProject.scenes[0];

        scene?.dispose();
        debuggerScene?.hide();
        newScene.draw();

        setScene(newScene);
        setCurrentProject(newProject);
        setEntities([...newScene?.entities || []]);
    };

    const onProjectFileSave = async () => {
        if (!currentProject) return;

        setCurrentProject(await new SaveProjectUseCase(projectRepo, sceneRepo, imageRepository).execute(currentProject));
    };

    return (
        <FlexBox $fill={true}>
            <ActionMenu onProjectFileOpen={onProjectFileOpen} onProjectFileSave={onProjectFileSave}></ActionMenu>
            <FlexBox $direction='row' $fill style={{ overflow: 'hidden' }}>
                <EntityFactoryPanel onAddEntity={onAddEntity}></EntityFactoryPanel>
                <EngineView onEngineReady={onEngineReady}></EngineView>
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
                                onUpdatePosition={onPositionUpdate}
                                onUpdateSize={onSizeUpdate}
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