import React from "react"
import { GameObject, StaticObject } from "sparkengineweb"
import { ScenePanel } from "."
import { fireEvent, render, screen } from '@testing-library/react';

describe('ScenePanel', () => {
    it('Should render the given entities', () => {
        const entityList = [
            new GameObject(),
            new StaticObject(),
            new GameObject()
        ]

        render(<ScenePanel entities={entityList} onRemoveEntity={() => {}}></ScenePanel>)
        expect(screen.getAllByTestId('ScenePanel.EntityEntry').length).toBe(3);
    });

    describe('onRemove', () => {
        it('Should invoke the onEntityRemoved callback', () => {
            const entityList = [
                new GameObject(),
                new StaticObject(),
                new GameObject()
            ]

            const cb = jest.fn();
            render(<ScenePanel entities={entityList} onRemoveEntity={cb}></ScenePanel>);

            fireEvent.click(screen.getByTestId(`RemoveEntityButton.${entityList[0].uuid}`));
            expect(cb).toHaveBeenCalledWith(entityList[0]);
        });
    });
})