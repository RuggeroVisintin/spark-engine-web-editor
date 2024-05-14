import React, { useCallback, useState } from 'react';
import { GameEngine, IEntity, Scene, TransformComponent, Vec2 } from 'sparkengineweb';
import { Box, FlexBox } from '../../primitives';
import { EntityFactoryPanel, ScenePanel } from '../../templates';
import { EngineView } from '../../components';
import { EntityPropsPanel } from '../../templates/EntityPropsPanel';

export const EditorLayout = () => {
    const [scene, setScene] = useState<Scene>();
    const [entities, setEntities] = useState<IEntity[]>([]); 
    const [currentEntity, setCurrentEntity] = useState<IEntity>();

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
        setEntities([...scene.entities ?? []]);
    }, [scene]);

    const onPositionUpdate = ({ newPosition }: {newPosition: Vec2}) => {
        const transform = currentEntity?.getComponent<TransformComponent>('TransformComponent');
        if (!transform) return;
        
        transform.position = newPosition;
    }


    return (
        <FlexBox $fill={true}>
            <FlexBox style={{ height: '70px' }} $direction='row'>
                <Box style={{ backgroundColor: 'blue' }}></Box>
            </FlexBox>
            <FlexBox $direction='row'>
                <EntityFactoryPanel onAddEntity={onAddEntity}></EntityFactoryPanel>
                <EngineView onEngineReady={onEngineReady}></EngineView>
                <Box $size={0.25}>
                    <FlexBox $fill={true}>
                        <ScenePanel
                            entities={entities}
                            onRemoveEntity={onRemoveEntity}
                            onFocusEntity={(entity: IEntity) => setCurrentEntity(entity)}
                            currentEntity={currentEntity}
                        ></ScenePanel>
                        {currentEntity && <EntityPropsPanel entity={currentEntity} onUpdatePosition={onPositionUpdate}></EntityPropsPanel>}
                    </FlexBox>
                </Box>
            </FlexBox>
            <FlexBox style={{ height: '33%' }}>
                <Box style={{ backgroundColor: 'grey' }}></Box>
            </FlexBox>
        </FlexBox>
    )
}