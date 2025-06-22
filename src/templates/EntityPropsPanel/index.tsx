import React from "react";
import { IEntity, MaterialComponent, TransformComponent, Vec2 } from "@sparkengine";
import { FormInput } from "../../components";
import { Box, Spacing } from "../../primitives";
import { InputRow } from "../../primitives/InputRow";
import { MaterialPropsGroup } from "./components/MaterialPropsGroup";

interface EntityPropsPanelProps {
    entity: IEntity;
    onUpdatePosition?: CallableFunction,
    onUpdateSize?: CallableFunction,
    onMaterialUpdate?: CallableFunction
}

interface TransformPropsGroupProps {
    transform: TransformComponent,
    onUpdateSize?: CallableFunction,
    onUpdatePosition?: CallableFunction
}

const TransformPropsGroup = ({ transform, onUpdateSize, onUpdatePosition }: TransformPropsGroupProps) => {
    const transformPositionGroup = [
        <FormInput
            label="X"
            type="number"
            key="transform.position.x"
            defaultValue={transform.position.x}
            onChange={(newValue: number) => onUpdatePosition?.({ newPosition: new Vec2(newValue, transform.position.y) })}
            data-testid="EntityPropsPanel.Position.x"
        ></FormInput>,
        <FormInput
            label="Y"
            type="number"
            key="transform.position.y"
            defaultValue={transform.position.y}
            onChange={(newValue: number) => onUpdatePosition?.({ newPosition: new Vec2(transform.position.x, newValue) })}
            data-testid="EntityPropsPanel.Position.y"
        ></FormInput>
        // TODO -- Zindex
    ];

    const transformSizeInputs = [
        <FormInput
            label="W"
            type="number"
            key="transform.size.width"
            defaultValue={transform.size.width}
            onChange={(newValue: number) => onUpdateSize?.({ newSize: { width: newValue, height: transform.size.height } })}
            data-testid="EntityPropsPanel.Size.width"
        ></FormInput>,
        <FormInput
            label="H"
            type="number"
            key="transform.size.height"
            defaultValue={transform.size.height}
            onChange={(newValue: number) => onUpdateSize?.({ newSize: { width: transform.size.width, height: newValue } })}
            data-testid="EntityPropsPanel.Size.height"
        ></FormInput>
    ];

    return (
        <>
            <InputRow $direction="row" $fill={false} $wrap={true} $fillMethod="flex">
                <Box>Position</Box>
                {transformPositionGroup}
            </InputRow>
            <InputRow $direction="row" $fill={false} $wrap={true} $fillMethod="flex">
                <Box>Size</Box>
                {transformSizeInputs}
            </InputRow>
        </>
    )
};

export const EntityPropsPanel = ({ entity, onUpdatePosition, onUpdateSize, onMaterialUpdate }: EntityPropsPanelProps) => {
    const transform = entity.getComponent<TransformComponent>('TransformComponent');
    const material = entity.getComponent<MaterialComponent>('MaterialComponent');

    return (
        <Box $size={1} $scroll $divide $spacing={Spacing.lg}>
            {transform && <TransformPropsGroup
                transform={transform} onUpdatePosition={onUpdatePosition} onUpdateSize={onUpdateSize}></TransformPropsGroup>}
            <hr />
            {material && <MaterialPropsGroup
                material={material}
                parentUuid={entity.uuid}
                onMaterialUpdate={onMaterialUpdate}
            />}
        </Box>
    )
}