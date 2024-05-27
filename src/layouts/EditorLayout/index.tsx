import React, { useCallback, useState } from 'react';
import { GameEngine, GameObject, IEntity, Rgb, Scene, TransformComponent, Vec2 } from 'sparkengineweb';
import { Box, FlexBox } from '../../primitives';
import { EntityFactoryPanel, ScenePanel } from '../../templates';
import { EngineView } from '../../components';
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
        diffuseColor: new Rgb(0, 255, 0)
    },
    shape: {
        isWireframe: true
    }
});

export const EditorLayout = () => {
    const [scene, setScene] = useState<Scene>();
    const [entities, setEntities] = useState<IEntity[]>([]); 
    const [currentEntity, setCurrentEntity] = useState<IEntity | undefined>(undefined);

    const onEngineReady = useCallback((engine: GameEngine) => {
        setScene(engine.createScene());
        engine.run();
    }, []);

    const onAddEntity = useCallback((entity: IEntity) => {
        if (!scene) return;

        scene.registerEntity(entity);
        setEntities([...scene.entities ?? []]);
    }, [scene]);

    const onRemoveEntity = useCallback((entity: IEntity) => {
        if (!scene) return;

        scene.unregisterEntity(entity.uuid);
        scene.unregisterEntity(debuggerEntity.uuid);
        setEntities([...scene.entities ?? []]);
        setCurrentEntity(undefined);
    }, [scene]);

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

        setDebuggerEntity(target, debuggerEntity);
        scene?.registerEntity(debuggerEntity);
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