import React, { useCallback, useRef, useState } from 'react';
import { GameEngine, GameObject, IEntity, MaterialComponent, Rgb, Scene, TransformComponent, Vec2 } from '@sparkengine';
import { EngineView } from '../../components';
import { Box, FlexBox } from '../../primitives';
import { EntityFactoryPanel, ScenePanel } from '../../templates';
import { ActionMenu } from '../../templates/ActionMenu';
import { EntityPropsPanel } from '../../templates/EntityPropsPanel';
import { SetDebuggerEntityUseCase } from '../../core/scene/usecases';
import { SceneRepository } from '../../core/scene/ports';
import { FileSystemSceneRepository } from '../../core/scene/adapters';
import { OpenProjectUseCase } from '../../core/project/usecases/OpenProjectUseCase';
import { ProjectRepository } from '../../core/project/ports';
import { FileSystemProjectRepository } from '../../core/project/adapters';
import { SaveProjectUseCase } from '../../core/project/usecases';
import { Project } from '../../core/project/models';

const debuggerEntity = new GameObject({
    name: 'DebuggerEntity',
    material: {
        diffuseColor: new Rgb(255, 255, 0)
    },
    shape: {
        isWireframe: true
    },
    transform: {
        depthIndex: 0
    }
});

let sceneRepo: SceneRepository;
let projectRepo: ProjectRepository;

export const EditorLayout = () => {
    const [currentProject, setCurrentProject] = useState<Project>(new Project({ name: 'my-project', scenes: [] }));
    const [scene, setScene] = useState<Scene>();
    const [debuggerScene, setDebuggerScene] = useState<Scene>();
    const [entities, setEntities] = useState<IEntity[]>([]);
    const [currentEntity, setCurrentEntity] = useState<IEntity | undefined>(undefined);
    const engine = useRef<GameEngine>();


    const onEngineReady = (newEngine: GameEngine) => {
        newEngine.renderer.defaultWireframeThickness = 3;

        sceneRepo = new FileSystemSceneRepository(newEngine);
        projectRepo = new FileSystemProjectRepository();

        const scene = newEngine.createScene(true);

        currentProject.addScene(scene);

        setScene(scene);
        setDebuggerScene(newEngine.createScene(true));

        newEngine.run();

        engine.current = newEngine;
        // eslint-disable-next-line
    };

    const onAddEntity = useCallback((entity: IEntity) => {
        if (!scene) return;

        scene.registerEntity(entity);
        setEntities([...scene.entities ?? []]);
    }, [scene]);

    const onRemoveEntity = useCallback((entity: IEntity) => {
        if (!scene || !debuggerScene) return;

        scene.unregisterEntity(entity.uuid);
        debuggerScene.unregisterEntity(debuggerEntity.uuid);
        setEntities([...scene.entities ?? []]);
        setCurrentEntity(undefined);
    }, [scene, debuggerScene]);

    const onPositionUpdate = ({ newPosition }: { newPosition: Vec2 }) => {
        const transform = currentEntity?.getComponent<TransformComponent>('TransformComponent');
        if (!transform) return;

        transform.position = newPosition;
        new SetDebuggerEntityUseCase(debuggerScene).execute(currentEntity!, debuggerEntity);
    }

    const onSizeUpdate = ({ newSize }: { newSize: { width: number, height: number } }) => {
        const transform = currentEntity?.getComponent<TransformComponent>('TransformComponent');
        if (!transform) return;

        transform.size = newSize;
        new SetDebuggerEntityUseCase(debuggerScene).execute(currentEntity!, debuggerEntity);
    }

    const onMaterialUpdate = ({ newDiffuseColor, newOpacity }: { newDiffuseColor: Rgb, newOpacity: number }) => {
        const material = currentEntity?.getComponent<MaterialComponent>('MaterialComponent');

        if (!material) return;

        material.diffuseColor = newDiffuseColor ?? material.diffuseColor;
        material.opacity = newOpacity ?? material.opacity;
    }

    const onEntityFocus = (target: IEntity) => {
        setCurrentEntity(target);
        new SetDebuggerEntityUseCase(debuggerScene).execute(target, debuggerEntity, true);
    }

    const onProjectFileOpen = async () => {
        if (!sceneRepo) return;

        const newProject = await new OpenProjectUseCase(projectRepo, sceneRepo)
            .execute();

        const newScene = newProject.scenes[0];

        scene?.dispose();
        newScene.draw();

        setScene(newScene);
        setCurrentProject(newProject);
        setEntities([...newScene?.entities || []]);

        if (debuggerEntity) {
            debuggerScene?.unregisterEntity(debuggerEntity.uuid);
        }
    };

    const onProjectFileSave = async () => {
        if (!currentProject) return;

        setCurrentProject(await new SaveProjectUseCase(projectRepo, sceneRepo).execute(currentProject));
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