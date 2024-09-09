import React, { useId } from "react";
import { MaterialComponent, Rgb } from "sparkengineweb";
import { FormInput } from "../../../../components";
import { InputRow } from "../../../../primitives/InputRow";
import { Box } from "../../../../primitives";

export interface MaterialPropsGroupProps {
    material: MaterialComponent,
    parentUuid: string,
    onUpdateDiffuseColor?: CallableFunction
}

export const MaterialPropsGroup = ({ material, parentUuid, onUpdateDiffuseColor }: MaterialPropsGroupProps) => {
    const materialDiffuseColorGroup = [
        <FormInput
            label="R"
            key={`${parentUuid}${useId()}`}
            onChange={(newValue: number) => onUpdateDiffuseColor?.({ newDiffuseColor: new Rgb(newValue, material.diffuseColor?.g, material.diffuseColor?.b) })}
            defaultValue={material.diffuseColor?.r}
            data-testid="EntityPropsPanel.DiffuseColor.r"
        ></FormInput>,
        <FormInput
            label="G"
            key={`${parentUuid}${useId()}`}
            onChange={(newValue: number) => onUpdateDiffuseColor?.({ newDiffuseColor: new Rgb(material.diffuseColor?.r, newValue, material.diffuseColor?.b) })}
            defaultValue={material.diffuseColor?.g}
            data-testid="EntityPropsPanel.DiffuseColor.g"
        ></FormInput>,
        <FormInput
            label="B"
            key={`${parentUuid}${useId()}`}
            onChange={(newValue: number) => onUpdateDiffuseColor?.({ newDiffuseColor: new Rgb(material.diffuseColor?.r, material.diffuseColor?.g, newValue) })}
            defaultValue={material.diffuseColor?.b}
            data-testid="EntityPropsPanel.DiffuseColor.b"
        ></FormInput>
    ];

    return (
        <>
            <InputRow $direction="row" $fill={false} $wrap={true} $fillMethod="flex">
                <Box>Diffuse</Box>
                {materialDiffuseColorGroup}
            </InputRow>
        </>
    )
}