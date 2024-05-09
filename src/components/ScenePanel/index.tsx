import React from 'react';
import { Box } from '../primitives';
import { IEntity } from 'sparkengineweb';
import { v4 as uuid } from 'uuid';

interface ScenePanelProps {
    entities?: IEntity[],
    onRemoveEntity: CallableFunction
}

export const ScenePanel = ({ entities = [], onRemoveEntity }: ScenePanelProps) => {
    return (
        <Box $size={0.25} style={{borderLeft: '2px solid black'}} data-testid="ScenePanel">
            <ul>
                {entities.map((entity) => <li key={uuid()} data-testid="ScenePanel.EntityEntry">
                    {entity.name}
                    <button
                        onClick={() => onRemoveEntity(entity)}
                        data-testid={`RemoveEntityButton.${entity.uuid}`}
                    >X</button>
                </li>)}
            </ul>
        </Box>
    );
}