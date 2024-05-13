import React from "react";
import styled from "styled-components"
import { BackgroundColor, FlexBox } from "../../primitives";
import { v4 as uuid } from 'uuid';

const Input = styled.input`
    border: 1px solid ${BackgroundColor.Secondary};
    flex: 1;
    min-width: 15px;
    width: 100%;
`;

const Label = styled.label`
    display: inline-block;
`

interface FormInputProps {
    label?: string;
    onChange?: CallableFunction,
    defaultValue?: number 
}

export const FormInput = ({ label, onChange, defaultValue }: FormInputProps = {}) => {
    const id = uuid();

    return (
        <FlexBox $direction="row" $fill $fillMethod="flex">
            {label && <Label htmlFor={id}>{label}</Label>}
            <Input type="number" defaultValue={defaultValue} id={id} onChange={({target}) => onChange?.(target.value)}></Input>
        </FlexBox>
    )
}