import React from "react";
import { Box, FlexBox, Spacing } from "../../primitives";
import { FormInput } from "../../components";
import { IEntity, TransformComponent } from "sparkengineweb";
interface EntityPropsPanelProps {
    entity: IEntity;
}

export const EntityPropsPanel = ({ entity }: EntityPropsPanelProps) => {
    const transform = entity.getComponent('TransformComponent') as TransformComponent;

    const inputs = [
        ...transform && [
            FormInput({
                label: 'X',
                defaultValue: transform.position.x,
                onChange: (newValue: number) => {
                    transform.position.x = newValue;
                    console.log(`X changed: ${newValue}`)
                }
            }),
            FormInput({
                label: 'Y',
                defaultValue: transform.position.y,
                onChange: (newValue: string) => console.log(`X changed: ${newValue}`)
            }),
            FormInput({
                label: 'Z',
                onChange: (newValue: string) => console.log(`X changed: ${newValue}`)
            })
        ]
    ];

    return (
        <Box $size={1} $spacing={Spacing.large}>
            <FlexBox $direction="row" $fill={false} $wrap={true} $fillMethod="flex">
                <Box>Position</Box>
                {inputs}
            </FlexBox>
        </Box>
    )
}