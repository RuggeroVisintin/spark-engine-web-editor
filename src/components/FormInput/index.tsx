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
    defaultValue?: number | string,
    type?: string;
}

const typesMap: Record<string, string> = {
    'number': 'number',
    'string': 'text',
    'image': 'file'
}

export const FormInput = ({ label, onChange, defaultValue, "data-testid": dataTestId, type }: FormInputProps = {}) => {
    const id = useId();
    const inputType = type ? typesMap[type] : typesMap[typeof defaultValue] ?? 'text';

    const onValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = parseInt(event.target.value);
        onChange?.(newValue);
    }

    if (type === 'image') {
        return <FlexBox $direction="row" $fill $fillMethod="flex">
            {defaultValue && <img src={defaultValue as string} alt={defaultValue as string}></img>}
            {label && <Label htmlFor={id} data-testid={`${dataTestId}.InputField`}>{label}</Label>}
            <Input
                type={inputType}
                id={id}
                hidden={true}
            />
        </FlexBox>
    }

    return <FlexBox $direction="row" $fill $fillMethod="flex">
        {label && <Label htmlFor={id}>{label}</Label>}
        <Input
            type={inputType}
            id={id}
            defaultValue={defaultValue}
            onChange={onValueChange}
            data-testid={`${dataTestId}.InputField`}
        />
    </FlexBox>
}