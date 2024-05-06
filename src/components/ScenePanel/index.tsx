import React, { useEffect, useState } from 'react';
import { Box } from '../primitives';
import { IEntity } from 'sparkengineweb';

interface ScenePanelProps {
    entities?: IEntity[]
}

export const ScenePanel = ({ entities = [] }: ScenePanelProps) => {
    console.log('RENDER')

    return (
        <Box $size={0.25} style={{borderLeft: '2px solid black'}}>
            <ul>
                {entities.map((entity, idx) => <li key={idx}>{entity.name}</li>)}
            </ul>
        </Box>
    );
}