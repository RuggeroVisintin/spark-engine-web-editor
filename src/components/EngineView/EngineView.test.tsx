import React from "react";
import { render, screen } from "@testing-library/react";
import { EngineView } from ".";

describe('EngineView', () => {
    it('Should execute the onClick callback when clicked', async () => {
        const onClick = jest.fn();
        const onEngineReady = jest.fn();

        const engineView = <EngineView onEngineReady={onEngineReady} onClick={onClick} />;
        render(engineView);

        const canvas = await screen.findByTestId('EngineView.canvas');
        canvas.click();

        expect(onClick).toHaveBeenCalledWith(expect.any(MouseEvent));
    });
})