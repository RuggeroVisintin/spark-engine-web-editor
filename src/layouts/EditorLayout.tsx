import React, { useCallback, useState } from 'react';
import { Box, EngineView, EntityFactoryPanel, FlexBox } from '../components';
import { GameEngine, Scene } from 'sparkengineweb';

export const EditorLayout = () => {
    const [scene, setScene] = useState<Scene>();

    const onEngineReady = useCallback((engine: GameEngine) => {
        setScene(engine.createScene());
    }, [])

    return (
        <FlexBox>
            <FlexBox style={{ height: '70px' }}>
                <Box style={{ backgroundColor: 'blue' }}></Box>
            </FlexBox>
            <FlexBox $direction='row'>
                <EntityFactoryPanel scene={scene}></EntityFactoryPanel>
                <EngineView onEngineReady={onEngineReady}></EngineView>
                <Box $size={0.25} style={{ backgroundColor: 'green' }}></Box>
            </FlexBox>
            <FlexBox style={{ height: '33%' }}>
                <Box style={{ backgroundColor: 'grey' }}></Box>
            </FlexBox>
        </FlexBox>
    )
}