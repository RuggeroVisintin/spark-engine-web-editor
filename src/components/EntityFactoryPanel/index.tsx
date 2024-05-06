import React from 'react';
import { Box } from '../primitives';
import { GameObject, Rgb, Scene, Vec2 } from 'sparkengineweb';

interface EntityFactoryPanelProps {
    onAddEntity: Function
}

const newGameObject = () => new GameObject({
    transform: {
        size: { width: 30, height: 30 },
        position: new Vec2(55, 55)
    },
    material: {
        diffuseColor: new Rgb(255, 0, 0)
    }
})

export const EntityFactoryPanel = ({ onAddEntity }: EntityFactoryPanelProps) => {
    return (
        <Box
            $size={0.25}
            style={{ borderRight: '2px solid black' }}
            data-testid="EntityFactoryPanel"
        >
            <Box onClick={() => onAddEntity(newGameObject())} data-testid="AddGameObjectButton" style={{padding: '20px'}}>Add Game Object</Box>
        </Box>
    )
}