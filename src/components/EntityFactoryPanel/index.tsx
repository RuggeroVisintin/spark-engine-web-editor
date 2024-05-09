import React from 'react';
import { Box } from '../../primitives';
import { GameObject, Rgb, StaticObject, Vec2 } from 'sparkengineweb';

interface EntityFactoryPanelProps {
    onAddEntity: Function
}

const defaultTransformProps = {
    transform: {
        size: { width: 30, height: 30 },
        position: new Vec2(55, 55)
    }
}

const defaultMaterialProps = {
    material: {
        diffuseColor: new Rgb(255, 0, 0)
    }
}

const newGameObject = () => new GameObject({
    ...defaultTransformProps,
    ...defaultMaterialProps
});

const newStaticObject = () => new StaticObject({
    ...defaultTransformProps,
    ...defaultMaterialProps
});

const entityTypes = {
    'GameObject': newGameObject,
    'StaticObject': newStaticObject,
    // TODO: implement optional target in SparkEngineWeb
    // 'TriggerEntity': newTriggerEntity
}

export const EntityFactoryPanel = ({ onAddEntity }: EntityFactoryPanelProps) => {
    return (
        <Box
            $size={0.25}
            data-testid="EntityFactoryPanel"
        >
            {Object.entries(entityTypes).map(([entityType, entityFactoryFn]) => (
                <Box
                    key={entityType}
                    onClick={() => onAddEntity(entityFactoryFn())}
                    data-testid={`Add${entityType}Button`}
                    style={{ padding: '20px' }}>Add { entityType }</Box>
            ))}
        </Box>
    )
}