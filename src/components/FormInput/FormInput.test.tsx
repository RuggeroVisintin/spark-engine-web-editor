import { FormInput } from './index';
import React from 'react';
import { render, screen } from '@testing-library/react';

describe('FormInput', () => {
    it('Should show the image selection input when no default value is provided', () => {
        const formInput = <FormInput type="image" data-testid='testInput'></FormInput>;

        render(formInput);

        expect(screen.getByTestId('testInput.InputField')).toBeVisible()
    });

    it('Should hide the image selection input when a default value is provided', () => {
        const formInput = <FormInput type="image" defaultValue="test" data-testid='testInput'></FormInput>;

        render(formInput);

        expect(screen.getByTestId('testInput.InputField')).not.toBeVisible();
    });
});