import React, { useId } from "react";
import styled from "styled-components"
import { BackgroundColor, FlexBox } from "../../primitives";
import { WithDataTestId } from "../../common";

const Input = styled.input`
    border: 1px solid ${BackgroundColor.Secondary};
    flex: 1;
    min-width: 15px;
    width: 100%;
`;

const Label = styled.label`
    display: inline-block;
`;

interface FormInputProps extends WithDataTestId {
    label?: string;
    onChange?: CallableFunction,
    defaultValue?: number 
}

const typesMap: Record<string, string> = {
    'number': 'number',
    'string': 'text'
}

export const FormInput = ({ label, onChange, defaultValue, "data-testid": dataTestId }: FormInputProps = {}) => {
    const id = useId();

    const onValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = parseInt(event.target.value);
        onChange?.(newValue);
    }

    return (
        <FlexBox $direction="row" $fill $fillMethod="flex">
            {label && <Label htmlFor={id}>{label}</Label>}
            <Input
                type={typesMap[typeof defaultValue] ?? 'text'}
                id={id}
                defaultValue={defaultValue}
                onChange={onValueChange}
                data-testid={`${dataTestId}.InputField`}
            ></Input>
        </FlexBox>
    )
}