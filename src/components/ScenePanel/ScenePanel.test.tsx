import React from "react"
import { GameObject, StaticObject } from "sparkengineweb"
import { ScenePanel } from "."
import { render, screen } from '@testing-library/react';

describe('ScenePanel', () => {
    it('Should render the given entities', () => {
        const entityList = [
            new GameObject(),
            new StaticObject(),
            new GameObject()
        ]

        render(<ScenePanel entities={entityList}></ScenePanel>)
        expect(screen.getAllByTestId('ScenePanel.EntityEntry').length).toBe(3);
    });

    describe('onRemove', () => {
        it.todo('Should remove the entity from the list');
        it.todo('Should invoke the onEntityRemoved callback');
    });
})