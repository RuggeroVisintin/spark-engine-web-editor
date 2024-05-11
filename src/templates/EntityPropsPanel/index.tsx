import React from "react"
import { Box, Spacing } from "../../primitives"
import { FormInput } from "../../components"

export const EntityPropsPanel = () => {
    return (
        <Box $size={1} $spacing={Spacing.large}>
            <FormInput label="Position"></FormInput>
        </Box>
    )
}