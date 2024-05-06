import React from 'react';

import { render, screen, fireEvent } from '@testing-library/react';
import { EntityFactoryPanel } from '.';
import { GameObject, IEntity, StaticObject } from 'sparkengineweb';

describe('EntityFactoryPanel', () => {
    describe("Add Game Object", () => {
        it.each([[
            'GameObject',
            GameObject
        ], [
            'StaticObject',
            StaticObject
        ]])('Should create a new %s when triggered', (entityType, entityCtr) => {            
            const cb = jest.fn();

            render(<EntityFactoryPanel onAddEntity={(entity: IEntity) => cb(entity)} />);
            
            fireEvent.click(screen.getByTestId(`Add${entityType}Button`));

            expect(cb).toHaveBeenCalledWith(expect.any(entityCtr));
        })
    })
})
