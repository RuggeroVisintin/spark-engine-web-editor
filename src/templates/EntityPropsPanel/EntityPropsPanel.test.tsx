import React from "react";
import { GameObject, Vec2 } from "sparkengineweb";
import { EntityPropsPanel } from ".";
import { fireEvent, render, screen } from "@testing-library/react";

describe('EntityPropsPanel', () => {
    it('Should initialize the position input props to the same value as the selected entity', () => {
        const entity = new GameObject();
        entity.transform.position.x = 1;
        entity.transform.position.y = 2;

        render(<EntityPropsPanel entity={entity} />);

        const inputField = screen.getByTestId('EntityPropsPanel.Position.x.InputField');

        expect(inputField).toHaveValue(entity.transform.position.x);
    });

    it('Should update the default value when entity is changed', () => {
        const entity = new GameObject();
        entity.transform.position.x = 1;
        entity.transform.position.y = 2;

        const { rerender } = render(<EntityPropsPanel entity={entity} />);

        const newEntity = new GameObject();

        rerender(<EntityPropsPanel entity={newEntity} />);

        const inputField = screen.getByTestId('EntityPropsPanel.Position.x.InputField');
        expect(inputField).toHaveValue(newEntity.transform.position.x);
    });

    it.each([
        ['EntityPropsPanel.Position.x.InputField', new Vec2(23, 0)],
        ['EntityPropsPanel.Position.y.InputField', new Vec2(0, 23)]
    ])('Should invoke the entityPropsUpdate callback when the %s input changes', (testId, expectedResult) => {
        const entity = new GameObject();

        const cb = jest.fn();

        render(<EntityPropsPanel entity={entity} onUpdatePosition={cb} />);

        const inputField = screen.getByTestId(testId);
        fireEvent.change(inputField, {target: {value: '23'}})

        expect(cb).toHaveBeenCalledWith({newPosition: expectedResult});
    })
})