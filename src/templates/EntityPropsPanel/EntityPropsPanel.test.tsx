import React from "react";
import { GameObject, Vec2 } from "sparkengineweb";
import { EntityPropsPanel } from ".";
import { fireEvent, render, screen } from "@testing-library/react";


describe('EntityPropsPanel', () => {
    describe('Transform', () => {
        describe('.position', () => {
            const positionProps: ('x' | 'y')[] = ['x', 'y'];

            it.each(positionProps)('Should initialize the position input props to the same value as the selected entity', (prop) => {
                const entity = new GameObject();
                entity.transform.position[prop] = 1;

                render(<EntityPropsPanel entity={entity} />);

                const inputFieldX = screen.getByTestId(`EntityPropsPanel.Position.${prop}.InputField`);

                expect(inputFieldX).toHaveValue(entity.transform.position[prop]);
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

            it.each(positionProps)('Should invoke the onUpdatePosition callback when the %s input changes', (prop) => {
                const entity = new GameObject();

                const result = new Vec2();
                result[prop] = 23;

                const cb = jest.fn();

                render(<EntityPropsPanel entity={entity} onUpdatePosition={cb} />);

                const inputField = screen.getByTestId(`EntityPropsPanel.Position.${prop}.InputField`);
                fireEvent.change(inputField, { target: { value: '23' } })

                expect(cb).toHaveBeenCalledWith({ newPosition: result });
            });
        })
       
        describe('.size', () => {
            const sizeProps: ('width' | 'height')[] = ['width', 'height'];

            it.each(sizeProps)('Should initialize the size input props to the same value as the selected entity', (prop) => {
                const entity = new GameObject();
                entity.transform.size[prop] = 1;

                render(<EntityPropsPanel entity={entity} />);

                const inputField= screen.getByTestId(`EntityPropsPanel.Size.${prop}.InputField`);

                expect(inputField).toHaveValue(entity.transform.size[prop]);
            });

            it.each(sizeProps)('Should update the default transform.size.%s value when entity is changed', (prop) => {
                const entity = new GameObject();
                entity.transform.size[prop] = 1;

                const { rerender } = render(<EntityPropsPanel entity={entity} />);

                const newEntity = new GameObject();

                rerender(<EntityPropsPanel entity={newEntity} />);

                const inputField = screen.getByTestId(`EntityPropsPanel.Size.${prop}.InputField`);

                expect(inputField).toHaveValue(newEntity.transform.size[prop]);
            });

            it.each(sizeProps)('Should invoke the onUpdateSize callback when size.%s input changes', (prop) => {
                const entity = new GameObject();
                entity.transform.size = {width: 15, height: 10}

                const result = { ...entity.transform.size };
                result[prop] = 23;

                const cb = jest.fn();

                render(<EntityPropsPanel entity={entity} onUpdateSize={cb} />);

                const inputField = screen.getByTestId(`EntityPropsPanel.Size.${prop}.InputField`);
                fireEvent.change(inputField, { target: { value: '23' } })

                expect(cb).toHaveBeenCalledWith({ newSize: result });
            });
        })
    })

   
})