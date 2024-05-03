import React from 'react';

import { render, screen, fireEvent } from '@testing-library/react';
import { EntityFactoryPanel } from '.';
import { GameEngine, GameObject } from 'sparkengineweb';

jest.mock('uuid', () => ({
    v4: () => 'test-uuid'
}))

describe('EntityFactoryPanel', () => {
    describe("Add Game Object", () => {
        it('Should create a new GameObject when triggered', () => {
            const gameEngine = new GameEngine({
                context: new CanvasRenderingContext2D(),
                resolution: { width: 1920, height: 1080 },
                framerate: 60
            });
            
            const scene = gameEngine.createScene();

            render(<EntityFactoryPanel scene={scene} />);
            
            fireEvent.click(screen.getByTestId('EntityFactoryPanel'));

            expect(scene.entities[0]).toBeInstanceOf(GameObject);
        })
    })
})
