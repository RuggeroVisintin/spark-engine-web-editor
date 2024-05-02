import React from 'react';
import { Box, EngineView, FlexBox } from '../components';

export const EditorLayout = () => {
    const onEngineReady = () => {
    }

    return (
        <FlexBox>
            <FlexBox style={{ height: '70px' }}>
                <Box style={{ backgroundColor: 'blue' }}></Box>
            </FlexBox>
            <FlexBox $direction='row'>
                <Box $size={0.25} style={{ backgroundColor: 'red' }}></Box>
                <EngineView onEngineReady={onEngineReady}></EngineView>
                <Box $size={0.25} style={{ backgroundColor: 'green' }}></Box>
            </FlexBox>
            <FlexBox style={{ height: '33%' }}>
                <Box style={{ backgroundColor: 'grey' }}></Box>
            </FlexBox>
        </FlexBox>
    )
}