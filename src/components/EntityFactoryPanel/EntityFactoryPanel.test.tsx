import React from 'react';

import { render, screen, fireEvent } from '@testing-library/react';
import { EntityFactoryPanel } from '.';
import { GameObject } from 'sparkengineweb';

describe('EntityFactoryPanel', () => {
    describe("Add Game Object", () => {
        it('Should create a new GameObject when triggered', () => {            
            const cb = jest.fn();

            render(<EntityFactoryPanel onAddEntity={(entity: GameObject) => cb(entity)} />);
            
            fireEvent.click(screen.getByTestId('AddGameObjectButton'));

            expect(cb).toHaveBeenCalledWith(expect.any(GameObject));
        })
    })
})
