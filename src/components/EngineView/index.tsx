import React, { memo, useEffect, useRef } from 'react';
import { Box } from '../../primitives';
import styled from 'styled-components';
import { Function } from '../../common';

export interface MouseClickEvent {
    targetX: number;
    targetY: number;
    button: number
}

export interface OnEngineViewReadyCBProps {
    context: CanvasRenderingContext2D;
    resolution: { width: number, height: number };
};

interface EngineViewProps {
    onEngineViewReady: Function<OnEngineViewReadyCBProps>
    onClick?: Function<MouseClickEvent>
}

const RenderingCanvas = styled.canvas({
    width: '100%',
    background: 'black'
})

let isEngineInit = false;
const width = 1920;
const height = 1080;

function mouseEventToMouseClickEvent(e: MouseEvent): MouseClickEvent {
    const rect = (e.target as HTMLElement).getBoundingClientRect();

    const scaleFactorX = rect.width ? width / rect.width : 1;
    const scaleFactorY = rect.height ? height / rect.height : 1;

    return {
        targetX: Math.round((e.clientX - rect.left) * scaleFactorX),
        targetY: Math.round((e.clientY - rect.top) * scaleFactorY),
        button: e.button
    }
}

export const EngineView = memo(({ onEngineViewReady, onClick }: EngineViewProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!!canvasRef.current && !isEngineInit) {
            onEngineViewReady({
                context: canvasRef.current.getContext('2d') as CanvasRenderingContext2D,
                resolution: { width, height }
            } as OnEngineViewReadyCBProps);
            isEngineInit = true;

            canvasRef.current.addEventListener(`contextmenu`, (e) => {
                if (onClick) {
                    e.preventDefault();
                    onClick(mouseEventToMouseClickEvent(e));
                }
            });
        }

    }, [canvasRef, onEngineViewReady, onClick]);

    return (
        <Box>
            <RenderingCanvas
                ref={canvasRef}
                id="canvas"
                data-testid="EngineView.canvas"
                width={width}
                height={height}
                onClick={(e) => onClick?.(mouseEventToMouseClickEvent(e.nativeEvent))}
            ></RenderingCanvas>
        </Box>
    )
}, () => true);