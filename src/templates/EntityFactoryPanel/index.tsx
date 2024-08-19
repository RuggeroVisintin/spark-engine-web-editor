import React from 'react';
import { GameObject, Rgb, StaticObject, TriggerEntity, Vec2 } from 'sparkengineweb';
import { ListItem } from '../../components';
import { Box, Spacing } from '../../primitives';

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

interface EntityDictEntry {
    factory: CallableFunction,
    icon: string
}

const entityDict: Record<string, EntityDictEntry> = {
    'GameObject': {
        factory: newGameObject,
        icon: 'game_object_icon.jpeg'
    },
    'StaticObject': {
        factory: newStaticObject,
        icon: 'static_object_icon.jpeg'
    },
    'TriggerObject': {
        factory: () => new TriggerEntity(),
        icon: 'trigger_icon.jpeg'
    }
    // TODO: implement optional target in SparkEngineWeb
    // 'TriggerEntity': newTriggerEntity
}

export const EntityFactoryPanel = ({ onAddEntity }: EntityFactoryPanelProps) => {
    return (
        <Box
            $size={0.25}
            $spacing={Spacing.sm}
            data-testid="EntityFactoryPanel"
        >
            {Object.entries(entityDict).map(([entityType, {factory, icon}]) => (
                <ListItem
                    key={entityType}
                    text={`Add ${entityType}`}
                    onClick={() => onAddEntity(factory())}
                    imgSrc={icon}
                    data-testid={`Add${entityType}Button`}/>
            ))}
        </Box>
    )
}