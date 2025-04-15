import React from "react";
import { FormInput } from ".";
import { render, screen } from "@testing-library/react";
import { setMockedFile } from "../../__mocks__/fs-api.mock";
import { ImageAsset } from "sparkengineweb";

describe('FormInput', () => {
    describe('image', () => {
        it('Should load an ImageAsset from the file system when clicked', async () => {
            setMockedFile('assets/test.png');

            const promise = new Promise(async (resolve) => {
                const inputItem = <FormInput type="image" data-testid="test-input" label="Image" onChange={(image: ImageAsset) => {
                    expect(image).toBeInstanceOf(ImageAsset);
                    resolve(null);
                }} />;

                render(inputItem);

                const inputField = await screen.findByTestId('test-input.InputField');
                inputField.click();
            });

            await promise;
        });
    })
})