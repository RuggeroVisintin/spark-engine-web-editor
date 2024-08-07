import React, { useCallback, useState } from 'react';
import { GameEngine, GameObject, IEntity, Rgb, Scene, TransformComponent, Vec2 } from 'sparkengineweb';
import { EngineView } from '../../components';
import { Box, FlexBox } from '../../primitives';
import { EntityFactoryPanel, ScenePanel } from '../../templates';
import { EntityPropsPanel } from '../../templates/EntityPropsPanel';

const setDebuggerEntity = (target: IEntity, debuggerEntity: IEntity) => {
    const debuggerTransform = debuggerEntity.getComponent<TransformComponent>('TransformComponent');
    const targetTransform = target.getComponent<TransformComponent>('TransformComponent');

    if (!targetTransform || !debuggerTransform) {
        return;
    }

    debuggerTransform.position = targetTransform.position;
    debuggerTransform.size = targetTransform.size;
}

const debuggerEntity = new GameObject({
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

export const EditorLayout = () => {
    const [scene, setScene] = useState<Scene>();
    const [debuggerScene, setDebuggerScene] = useState<Scene>();
    const [entities, setEntities] = useState<IEntity[]>([]); 
    const [currentEntity, setCurrentEntity] = useState<IEntity | undefined>(undefined);

    const onEngineReady = useCallback((engine: GameEngine) => {
        engine.renderer.defaultWireframeThickness = 3;
        setScene(engine.createScene());
        setDebuggerScene(engine.createScene());
        engine.run();
    }, []);

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

    const onPositionUpdate = ({ newPosition }: {newPosition: Vec2}) => {
        const transform = currentEntity?.getComponent<TransformComponent>('TransformComponent');
        if (!transform) return;

        transform.position = newPosition;
        setDebuggerEntity(currentEntity!, debuggerEntity);
    }

    const onSizeUpdate = ({ newSize }: { newSize: { width: number, height: number } }) => {
        const transform = currentEntity?.getComponent<TransformComponent>('TransformComponent');
        if (!transform) return;

        transform.size = newSize;
        setDebuggerEntity(currentEntity!, debuggerEntity);
    }

    const onEntityFocus = (target: IEntity) => {
        setCurrentEntity(target);

        if (debuggerEntity) {
            debuggerScene?.unregisterEntity(debuggerEntity.uuid);
        }

        setDebuggerEntity(target, debuggerEntity);
        debuggerScene?.registerEntity(debuggerEntity);
    }

    return (
        <FlexBox $fill={true}>
            <FlexBox style={{ height: '40px' }} $direction='row'>
                <Box style={{ backgroundColor: 'blue' }}></Box>
            </FlexBox>
            <FlexBox $direction='row' $fill style={{overflow: 'hidden'}}>
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