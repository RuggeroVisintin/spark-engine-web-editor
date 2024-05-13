import React from "react";
import { Box, FlexBox, Spacing } from "../../primitives";
import { FormInput } from "../../components";

export const EntityPropsPanel = () => {
    const inputs = [
        FormInput({ label: 'X' }),
        FormInput({ label: 'Y' }),
        FormInput({ label: 'Z' }),
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