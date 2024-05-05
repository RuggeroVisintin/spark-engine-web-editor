import React from 'react';
import { Box } from '../primitives';
import { GameObject, Rgb, Scene, Vec2 } from 'sparkengineweb';

interface EntityFactoryPanelProps {
    scene?: Scene
}

export const EntityFactoryPanel = ({ scene }: EntityFactoryPanelProps) => {
    const onAddGameObjectClick = () => {
        if (!scene) return;

        scene.registerEntity(new GameObject({
            transform: {
                size: { width: 30, height: 30 },
                position: new Vec2(55, 55)
            },
            material: {
                diffuseColor: new Rgb(255, 0, 0)
            }
        }));
    }

    return (
        <Box
            $size={0.25}
            style={{ borderRight: '2px solid black' }}
            data-testid="EntityFactoryPanel"
        >
            <Box onClick={() => onAddGameObjectClick()} data-testid="AddGameObjectButton" style={{padding: '20px'}}>Add Game Object</Box>
        </Box>
    )
}