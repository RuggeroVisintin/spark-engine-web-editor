import React, { useCallback, useState } from 'react';
import { Box, EngineView, EntityFactoryPanel, FlexBox, ScenePanel } from '../components';
import { GameEngine, IEntity, Scene } from 'sparkengineweb';

export const EditorLayout = () => {
    const [scene, setScene] = useState<Scene>();
    const [entities, setEntities] = useState<IEntity[]>([]); 

    const onEngineReady = useCallback((engine: GameEngine) => {
        setScene(engine.createScene());
        engine.run();
    }, []);

    const onAddEntity = useCallback((entity: IEntity) => {
        if (!scene) return;

        scene.registerEntity(entity);
        setEntities([...scene.entities ?? []]);
    }, [scene])

    const onRemoveEntity = useCallback((entity: IEntity) => {
        if (!scene) return; 

        scene.unregisterEntity(entity.uuid);
        setEntities([...scene.entities ?? []]);
    }, [scene])

    return (
        <FlexBox>
            <FlexBox style={{ height: '70px' }}>
                <Box style={{ backgroundColor: 'blue' }}></Box>
            </FlexBox>
            <FlexBox $direction='row'>
                <EntityFactoryPanel onAddEntity={onAddEntity}></EntityFactoryPanel>
                <EngineView onEngineReady={onEngineReady}></EngineView>
                <ScenePanel entities={entities} onRemoveEntity={onRemoveEntity}></ScenePanel>
            </FlexBox>
            <FlexBox style={{ height: '33%' }}>
                <Box style={{ backgroundColor: 'grey' }}></Box>
            </FlexBox>
        </FlexBox>
    )
}