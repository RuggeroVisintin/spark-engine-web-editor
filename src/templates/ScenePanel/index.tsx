import React from 'react';
import { Box, Spacing } from '../../primitives';
import { IEntity } from 'sparkengineweb';
import { ListItem } from '../../components';

interface ScenePanelProps {
    entities?: IEntity[];
    currentEntity?: IEntity;
    onRemoveEntity: CallableFunction;
    onFocusEntity: CallableFunction
}

export const ScenePanel = ({ entities = [], currentEntity, onRemoveEntity, onFocusEntity }: ScenePanelProps) => {
    return (
        <Box $size={0.5} $spacing={Spacing.small} $scroll data-testid="ScenePanel">
            {entities.map((entity) =>
                <ListItem
                    isAcitve={currentEntity?.uuid === entity.uuid}
                    key={entity.uuid}
                    text={entity.name}
                    data-testid={`ScenePanel.EntityEntry.${entity.uuid}`}
                    onClick={() => onFocusEntity(entity)}
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