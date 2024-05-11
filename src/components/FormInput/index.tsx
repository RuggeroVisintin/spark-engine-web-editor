import React from "react";
import styled from "styled-components"
import { BackgroundColor, Box, FlexBox } from "../../primitives";

const Input = styled.input`
    border: 1px solid ${BackgroundColor.Secondary};
    flex: 1;
`;

interface FormInputProps {
    label?: string;
}

export const FormInput = ({label}: FormInputProps) => {
    return (
        <FlexBox $direction="row">
            {label && <span>{label}</span>}
            <Input type="number" value={0}></Input>
        </FlexBox>
    )
}