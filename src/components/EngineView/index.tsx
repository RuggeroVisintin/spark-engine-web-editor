import React, { memo, useEffect, useRef } from 'react';
import { Box } from '../../primitives';
import styled from 'styled-components';
import { Function } from '../../common';

interface EngineViewProps {
    onEngineReady: Function<OnEngineReadyCBProps>
    onClick?: Function<MouseEvent>
}

export interface OnEngineReadyCBProps {
    context: CanvasRenderingContext2D;
    resolution: { width: number, height: number };
};

const RenderingCanvas = styled.canvas({
    width: '100%',
    background: 'black'
})

let isEngineInit = false;

export const EngineView = memo(({ onEngineReady, onClick }: EngineViewProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const width = 1920;
    const height = 1080;

    useEffect(() => {
        if (!!canvasRef.current && !isEngineInit) {
            onEngineReady({
                context: canvasRef.current.getContext('2d') as CanvasRenderingContext2D,
                resolution: { width, height }
            } as OnEngineReadyCBProps);
            isEngineInit = true;

            canvasRef.current.addEventListener(`contextmenu`, (e) => {
                if (onClick) {
                    e.preventDefault();
                    onClick(e);
                }
            });
        }

    }, [canvasRef, onEngineReady]);

    return (
        <Box>
            <RenderingCanvas
                ref={canvasRef}
                id="canvas"
                data-testid="EngineView.canvas"
                width={width}
                height={height}
                onClick={(e) => onClick?.(e.nativeEvent)}
            ></RenderingCanvas>
        </Box>
    )
}, () => true);