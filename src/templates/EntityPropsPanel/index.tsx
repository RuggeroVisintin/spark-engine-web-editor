import React, { useId } from "react";
import { IEntity, TransformComponent, Vec2 } from "sparkengineweb";
import styled from "styled-components";
import { FormInput } from "../../components";
import { Box, FlexBox, Spacing } from "../../primitives";
interface EntityPropsPanelProps {
    entity: IEntity;
    onUpdatePosition?: CallableFunction,
    onUpdateSize?: CallableFunction
}

const InputRow = styled(FlexBox)`
    &+${FlexBox} {
        margin-top: 5px;
    }
`

export const EntityPropsPanel = ({ entity, onUpdatePosition, onUpdateSize }: EntityPropsPanelProps) => {
    const transform = entity.getComponent('TransformComponent') as TransformComponent;

    const transformPositionInputs = [
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
    ];

    const transformSizeInputs = [
        <FormInput
            label="W"
            key={`${entity.uuid}${useId()}`}
            defaultValue={transform.size.width}
            onChange={(newValue: number) => onUpdateSize?.({ newSize: {width: newValue, height: transform.size.height} })}
            data-testid="EntityPropsPanel.Size.width"
        ></FormInput>,
        <FormInput
            label="H"
            key={`${entity.uuid}${useId()}`}
            defaultValue={transform.size.height}
            onChange={(newValue: number) => onUpdateSize?.({ newSize: {width: transform.size.width, height: newValue} })}
            data-testid="EntityPropsPanel.Size.height"
        ></FormInput>
    ];

    return (
        <Box $size={1} $scroll $divide $spacing={Spacing.lg}>
            {transform &&
                <>
                    <InputRow $direction="row" $fill={false} $wrap={true} $fillMethod="flex">
                        <Box>Position</Box>
                        {transformPositionInputs}
                    </InputRow>
                    <InputRow $direction="row" $fill={false} $wrap={true} $fillMethod="flex">
                        <Box>Size</Box>
                        {transformSizeInputs}
                    </InputRow>
                </>
            }
        </Box>
    )
}