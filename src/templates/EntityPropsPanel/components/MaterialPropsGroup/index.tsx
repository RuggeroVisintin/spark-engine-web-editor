import React from "react";
import { ImageAsset, MaterialComponent, Rgb } from "@sparkengine";
import { FormInput } from "../../../../components";
import { InputRow } from "../../../../primitives/InputRow";
import { Box, Button } from "../../../../primitives";
import { v4 } from 'uuid'

export interface MaterialPropsGroupProps {
    material: MaterialComponent,
    parentUuid: string,
    onMaterialUpdate?: CallableFunction,
}

export const MaterialPropsGroup = ({ material, parentUuid, onMaterialUpdate }: MaterialPropsGroupProps) => {
    const materialDiffuseColorGroup = [
        <FormInput type="color"
            key={`${parentUuid}${v4()}`}
            data-testid="EntityPropsPanel.DiffuseColor"
            defaultValue={material.diffuseColor?.toHexString()}
            onChange={(newDiffuseColor: string) => {
                console.log('newDiffuseColor', newDiffuseColor);
                onMaterialUpdate?.({ newDiffuseColor: Rgb.fromHex(newDiffuseColor) })
            }}
        ></FormInput>
    ];

    const matierialOpacityGroup = [
        <FormInput
            key={`${parentUuid}${v4()}`}
            data-testid="EntityPropsPanel.Opacity"
            defaultValue={material.opacity}
            type="number"
            onChange={(newValue: number) => onMaterialUpdate?.({ newOpacity: newValue })}
        ></FormInput>
    ]

    const meterialDiffuseTextureGroup = [
        <FormInput
            key={`${parentUuid}${v4()}`}
            data-testid="EntityPropsPanel.DiffuseTexture"
            type="image"
            label={material.diffuseTexture ? 'Replace' : 'Add'}
            onChange={(newDiffuseTexture: ImageAsset) => { onMaterialUpdate?.({ newDiffuseTexture }) }}
        ></FormInput>
    ]

    return (
        <>
            <InputRow $direction="row" $fill={false} $wrap={true} $fillMethod="flex">
                <Box>Color</Box>
                {materialDiffuseColorGroup}
                <Button onClick={() => onMaterialUpdate?.({ removeDiffuseColor: true })} data-testid="EntityPropsPanel.RemoveDiffuseColor">
                    X
                </Button>
            </InputRow>
            <InputRow $direction="row" $fill={false} $wrap={true} $fillMethod="flex">
                <Box>Opacity</Box>
                {matierialOpacityGroup}
            </InputRow>
            <InputRow $direction="row" $fill={false} $wrap={true} $fillMethod="flex">
                <Box>Texture</Box>
                {meterialDiffuseTextureGroup}
            </InputRow>
        </>
    )
}