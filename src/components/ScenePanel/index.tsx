import React from 'react';
import { Box } from '../primitives';
import { IEntity } from 'sparkengineweb';
import { v4 as uuid } from 'uuid';

interface ScenePanelProps {
    entities?: IEntity[]
}

export const ScenePanel = ({ entities = [] }: ScenePanelProps) => {
    return (
        <Box $size={0.25} style={{borderLeft: '2px solid black'}} data-testid="ScenePanel">
            <ul>
                {entities.map((entity) => <li key={uuid()} data-testid="ScenePanel.EntityEntry">{entity.name}</li>)}
            </ul>
        </Box>
    );
}