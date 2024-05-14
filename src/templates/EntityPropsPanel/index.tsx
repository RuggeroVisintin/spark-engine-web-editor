import React, { useEffect, useId } from "react";
import { Box, FlexBox, Spacing } from "../../primitives";
import { FormInput } from "../../components";
import { IEntity, TransformComponent, Vec2 } from "sparkengineweb";
interface EntityPropsPanelProps {
    entity: IEntity;
    onUpdatePosition?: CallableFunction
}

export const EntityPropsPanel = ({ entity, onUpdatePosition }: EntityPropsPanelProps) => {
    const transform = entity.getComponent('TransformComponent') as TransformComponent;

    const transformInputs = [
        <FormInput
            label="X"
            key={`${entity.uuid}${useId()}`}
            defaultValue={transform.position.x}
            onChange={(newValue: number) => onUpdatePosition?.({ newPosition: new Vec2(newValue, transform.position.y) })}
            data-testid="EntityPropsPanel.Position.x"
        ></FormInput>,
        <FormInput
            label="Y"
            key={`${entity.uuid}${useId()}`}
            defaultValue={transform.position.y}
            onChange={(newValue: number) => onUpdatePosition?.({ newPosition: new Vec2(transform.position.x, newValue) })}
            data-testid="EntityPropsPanel.Position.y"
        ></FormInput>
        // TODO -- Zindex
    ]

    return (
        <Box $size={1} $spacing={Spacing.large}>
            <FlexBox $direction="row" $fill={false} $wrap={true} $fillMethod="flex">
                <Box>Position</Box>
                {transform && transformInputs}
            </FlexBox>
        </Box>
    )
}