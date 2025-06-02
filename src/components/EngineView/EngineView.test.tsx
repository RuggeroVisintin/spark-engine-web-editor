import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { EngineView } from ".";


const pause = (timeout = 0) => new Promise(resolve => setTimeout(resolve, timeout));

describe('EngineView', () => {
    beforeEach(() => {
        Element.prototype.getBoundingClientRect = jest.fn(() => {
            return {
                left: 0,
                top: 0,
                width: 1920 / 1,
                height: 1080 / 1
            } as DOMRect;
        })
    })

    describe('.onClick()', () => {
        it('Should execute the onClick callback when clicked', async () => {
            const onClick = jest.fn();
            const onEngineReady = jest.fn();

            const engineView = <EngineView onEngineViewReady={onEngineReady} onClick={onClick} />;
            render(engineView);

            const canvas = await screen.findByTestId('EngineView.canvas');
            fireEvent.click(canvas, {
                clientX: 100,
                clientY: 200,
                button: 0
            })

            expect(onClick).toHaveBeenCalledWith(expect.objectContaining({
                button: 0,
                targetX: expect.any(Number),
                targetY: expect.any(Number)
            }));
        });

        it('Should provide view adjusted mouse coordinates', async () => {
            const onClick = jest.fn();
            const onEngineReady = jest.fn();

            const scaleFactor = 2;

            Element.prototype.getBoundingClientRect = jest.fn(() => {
                return {
                    left: 0,
                    top: 0,
                    width: 1920 / scaleFactor,
                    height: 1080 / scaleFactor
                } as DOMRect;
            })

            const engineView = <EngineView onEngineViewReady={onEngineReady} onClick={onClick} />;
            render(engineView);

            const canvas = await screen.findByTestId('EngineView.canvas');
            fireEvent.click(canvas, {
                clientX: 100,
                clientY: 200,
                button: 0
            })

            expect(onClick).toHaveBeenCalledWith(expect.objectContaining({
                button: 0,
                targetX: 100 * scaleFactor,
                targetY: 200 * scaleFactor
            }));
        });

        it('Should round coordinates to the nearest integer', async () => {
            const onClick = jest.fn();
            const onEngineReady = jest.fn();

            const scaleFactor = 1.261;

            Element.prototype.getBoundingClientRect = jest.fn(() => {
                return {
                    left: 0,
                    top: 0,
                    width: 1920 / scaleFactor,
                    height: 1080 / scaleFactor
                } as DOMRect;
            })

            const engineView = <EngineView onEngineViewReady={onEngineReady} onClick={onClick} />;
            render(engineView);

            const canvas = await screen.findByTestId('EngineView.canvas');
            fireEvent.click(canvas, {
                clientX: 100,
                clientY: 200,
                button: 0
            })

            expect(onClick).toHaveBeenCalledWith(expect.objectContaining({
                button: 0,
                targetX: Math.round(100 * scaleFactor),
                targetY: Math.round(200 * scaleFactor)
            }));
        });

        it('Shoudld not execute the onClick callback when the mouse is dragged', async () => {
            const onClick = jest.fn();
            const onEngineReady = jest.fn();

            const engineView = <EngineView onEngineViewReady={onEngineReady} onClick={onClick} />;
            render(engineView);

            const canvas = await screen.findByTestId('EngineView.canvas');
            fireEvent.mouseDown(canvas, { button: 0 });
            fireEvent.mouseMove(canvas, { clientX: 100, clientY: 200 });
            fireEvent.click(canvas, {
                clientX: 100,
                clientY: 200,
                button: 0
            })
            fireEvent.mouseUp(canvas, { button: 0 });

            await pause(100);

            fireEvent.click(canvas, {
                clientX: 10,
                clientY: 20,
                button: 0
            })

            expect(onClick).toHaveBeenNthCalledWith(1, expect.objectContaining({
                button: 0,
                targetX: 10,
                targetY: 20
            }));
        });
    });

    describe('.onMouseDragging()', () => {
        it('should execute when the mouse is being dragged', async () => {
            const onMouseDragging = jest.fn();
            const onEngineReady = jest.fn();

            const engineView = <EngineView onEngineViewReady={onEngineReady} onMouseDragging={onMouseDragging} />;
            render(engineView);

            const canvas = await screen.findByTestId('EngineView.canvas');
            fireEvent.mouseDown(canvas, { button: 0 });
            fireEvent.mouseMove(canvas, { clientX: 100, clientY: 200 });
            fireEvent.mouseUp(canvas, { button: 0 });

            expect(onMouseDragging).toHaveBeenCalled();
        });
    })

})