import React, { memo, useEffect, useRef } from 'react';
import { Box } from '../../primitives';
import styled from 'styled-components';
import { Function } from '../../core/common';
import { MouseClickEvent, MouseDragEvent } from '../../core/common/events/mouse';

export interface OnEngineViewReadyCBProps {
    context: CanvasRenderingContext2D;
    resolution: { width: number, height: number };
}

interface EngineViewProps {
    onEngineViewReady: Function<OnEngineViewReadyCBProps>;
    onClick?: Function<MouseClickEvent>;
    onMouseDragging?: Function<MouseDragEvent>;
    onMouseDragStart?: Function<MouseDragEvent>;
    onMouseDown?: Function<MouseClickEvent>
}

const RenderingCanvas = styled.canvas({
    width: '100%',
    background: 'black'
});

export const EngineView = memo(({ onEngineViewReady, onClick, onMouseDragging, onMouseDragStart, onMouseDown }: EngineViewProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    let isEngineInit = false;
    let isMouseDown = false;
    let isMouseDragging = false;

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

    function mouseEventToMouseDragEvent(e: MouseEvent): MouseDragEvent {

        const rect = (e.target as HTMLElement).getBoundingClientRect();

        const scaleFactorX = rect.width ? width / rect.width : 1;
        const scaleFactorY = rect.height ? height / rect.height : 1;

        return {
            targetX: Math.round((e.clientX - rect.left) * scaleFactorX),
            targetY: Math.round((e.clientY - rect.top) * scaleFactorY),
            button: e.button,
            deltaX: Math.round(e.movementX * scaleFactorX),
            deltaY: Math.round(e.movementY * scaleFactorX)
        }
    }

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
                onMouseDown={(e) => {
                    isMouseDown = true;
                    onMouseDown?.(mouseEventToMouseClickEvent(e.nativeEvent));
                }}
                // need to use setTimeout to avoid the mouseup event being triggered immediately after mousedown when the mouse is moving
                onMouseUp={() => setTimeout(() => { isMouseDown = false; isMouseDragging = false; }, 0)}
                onMouseMove={(e) => {
                    const wasMouseDragging = isMouseDragging;
                    isMouseDragging = isMouseDown && true;

                    if (!wasMouseDragging && isMouseDragging) {
                        onMouseDragStart?.(mouseEventToMouseDragEvent(e.nativeEvent));
                        return;
                    }

                    isMouseDragging && onMouseDragging?.(mouseEventToMouseDragEvent(e.nativeEvent));
                }}
                onClick={(e) => !isMouseDragging && onClick?.(mouseEventToMouseClickEvent(e.nativeEvent))}
            ></RenderingCanvas>
        </Box>
    )
}, () => true);