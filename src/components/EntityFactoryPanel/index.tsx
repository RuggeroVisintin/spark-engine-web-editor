import React from 'react';
import { Box } from '../primitives';
import { GameObject, Scene } from 'sparkengineweb';

interface EntityFactoryPanelProps {
    scene?: Scene
}

export const EntityFactoryPanel = ({ scene }: EntityFactoryPanelProps) => {
    const onAddGameObjectClick = () => {
        if (!scene) return;

        console.log('create Component')
        scene.registerEntity(new GameObject());
    }

    return (
        <Box
            $size={0.25}
            style={{ borderRight: '2px solid black' }}
            onClick={() => onAddGameObjectClick()}
            data-testid="EntityFactoryPanel"
        >
            <ul>
                <li> Add Game Object </li>
            </ul>
        </Box>
    )
}