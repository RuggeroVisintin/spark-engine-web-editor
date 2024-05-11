import React from 'react';
import { Box, Spacing } from '../../primitives';
import { IEntity } from 'sparkengineweb';
import { v4 as uuid } from 'uuid';
import { ListItem } from '../../components';

interface ScenePanelProps {
    entities?: IEntity[],
    onRemoveEntity: CallableFunction
}

export const ScenePanel = ({ entities = [], onRemoveEntity }: ScenePanelProps) => {
    return (
        <Box $size={1} $spacing={Spacing.small} data-testid="ScenePanel">
                {entities.map((entity) => 
                    <ListItem
                        key={uuid()}
                        text={entity.name}
                        data-testid="ScenePanel.EntityEntry"
                        button={{
                            "data-testid": `RemoveEntityButton.${entity.uuid}`,
                            text: 'X',
                            onClick: () => onRemoveEntity(entity)
                        }}
                    ></ListItem>
                )}
        </Box>
    );
}