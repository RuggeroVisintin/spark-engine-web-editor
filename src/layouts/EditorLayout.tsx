import React from 'react';
import { Box, FlexBox } from '../components';

export const EditorLayout = () => {
    return (
        <FlexBox>
            <FlexBox style={{ height: '70px' }}>
                <Box style={{ backgroundColor: 'blue' }}></Box>
            </FlexBox>
            <FlexBox $direction='row'>
                <Box $size={0.25} style={{ backgroundColor: 'red' }}></Box>
                <Box>
                    <canvas id="canvas" style={{ width: '100%', height: '100%' }}></canvas>
                </Box>
                <Box $size={0.25} style={{ backgroundColor: 'green' }}></Box>
            </FlexBox>
            <FlexBox style={{ height: '33%' }}>
                <Box style={{ backgroundColor: 'grey' }}></Box>
            </FlexBox>
        </FlexBox>
    )
}