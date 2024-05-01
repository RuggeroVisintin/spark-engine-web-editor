import React from 'react';
import { Box, FlexBox } from '../components';

export const EditorLayout = () => {
    return (
        <FlexBox>
            <FlexBox style={{height: '70px'}}>
                <Box style={{ backgroundColor: 'blue' }}></Box>
            </FlexBox>
            <FlexBox $direction='row'>
                <Box $size={0.25} style={{ backgroundColor: 'red'}}></Box>
                <Box style={{ backgroundColor: 'yellow' }}></Box>
                <Box $size={0.25} style={{ backgroundColor: 'green'}}></Box>
            </FlexBox>
            <FlexBox style={{height: '33%'}}>
                <Box style={{ backgroundColor: 'grey' }}></Box>
            </FlexBox>
        </FlexBox>
    )
}