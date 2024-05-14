import React from "react";
import { GameObject, Vec2 } from "sparkengineweb";
import { EntityPropsPanel } from ".";
import { fireEvent, render, screen } from "@testing-library/react";


describe('EntityPropsPanel', () => {
    describe('Transform', () => {
        const positionProps: ('x' | 'y')[] = ['x', 'y'];

        it.each(positionProps)('Should initialize the position input props to the same value as the selected entity', () => {
            const entity = new GameObject();
            entity.transform.position.x = 1;
            entity.transform.position.y = 2;

            render(<EntityPropsPanel entity={entity} />);

            const inputFieldX = screen.getByTestId('EntityPropsPanel.Position.x.InputField');
            const inputFieldY = screen.getByTestId('EntityPropsPanel.Position.y.InputField')

            expect(inputFieldX).toHaveValue(entity.transform.position.x);
            expect(inputFieldY).toHaveValue(entity.transform.position.y);
        });

        it.each(positionProps)('Should update the default transform.position.%s value when entity is changed', (prop) => {
            const entity = new GameObject();
            entity.transform.position[prop] = 1;

            const { rerender } = render(<EntityPropsPanel entity={entity} />);

            const newEntity = new GameObject();

            rerender(<EntityPropsPanel entity={newEntity} />);

            const inputField = screen.getByTestId(`EntityPropsPanel.Position.${prop}.InputField`);
            expect(inputField).toHaveValue(newEntity.transform.position[prop]);
        });

        it.each(positionProps)('Should invoke the entityPropsUpdate callback when the %s input changes', (prop) => {
            const entity = new GameObject();

            const result = new Vec2();
            result[prop] = 23;

            const cb = jest.fn();

            render(<EntityPropsPanel entity={entity} onUpdatePosition={cb} />);

            const inputField = screen.getByTestId(`EntityPropsPanel.Position.${prop}.InputField`);
            fireEvent.change(inputField, {target: {value: '23'}})

            expect(cb).toHaveBeenCalledWith({newPosition: result});
        })

    })

   
})