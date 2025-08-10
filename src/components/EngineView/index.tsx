import React, { memo, useEffect, useRef } from 'react';
import { Box } from '../../primitives';
import styled from 'styled-components';
import { Function } from '../../core/common';
import { MouseClickEvent, MouseDragEvent } from '../../core/common/events/mouse';

export interface OnEngineViewReadyCBProps {
    context: CanvasRenderingContext2D;
    resolution: { width: number, height: number };
}

type ModifierButtons = Map<string, boolean>;

interface EngineViewProps {
    onEngineViewReady: Function<OnEngineViewReadyCBProps>;
    onClick?: Function<MouseClickEvent>;
    onMouseDragging?: Function<MouseDragEvent>;
    onMouseDragStart?: Function<MouseDragEvent>;
    onMouseDown?: Function<MouseClickEvent>
}

interface RenderingCanvasProps {
    $isSpaceBarPressed?: boolean;
    $isMouseDragging?: boolean;
}

const RenderingCanvas = styled.canvas<RenderingCanvasProps>`
    width: 100%;
    background: black;
   
    ${props => props.$isSpaceBarPressed && !props.$isMouseDragging && `
        &:hover, &[data-test-hover="true"] {
            cursor: grab;
        }
    `}

    ${props => props.$isMouseDragging && props.$isSpaceBarPressed && `
        cursor: grabbing; 
    `}
`;

export const EngineView = memo(({ onEngineViewReady, onClick, onMouseDragging, onMouseDragStart, onMouseDown }: EngineViewProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [currentModifierButtons, setCurrentModifierButtons] = React.useState<ModifierButtons>(new Map<string, boolean>());
    const [isMouseDragging, setIsMouseDragging] = React.useState(false);
    const [lastMouseButton, setLastMouseButton] = React.useState(-1);

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

    function mouseEventToMouseDragEvent(e: MouseEvent, currentModifierButtons: ModifierButtons): MouseDragEvent {

        const rect = (e.target as HTMLElement).getBoundingClientRect();

        const scaleFactorX = rect.width ? width / rect.width : 1;
        const scaleFactorY = rect.height ? height / rect.height : 1;

        const modifiers: Record<string, true> = {};

        currentModifierButtons.forEach((value, key) => {
            if (value) {
                modifiers[key.toLowerCase()] = true;
            }
        });

        return {
            targetX: Math.round((e.clientX - rect.left) * scaleFactorX),
            targetY: Math.round((e.clientY - rect.top) * scaleFactorY),
            button: lastMouseButton,
            modifiers,
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


    useEffect(() => {
        window.addEventListener('keydown', (e) => {
            setCurrentModifierButtons(prev => {
                const newModifiers = new Map(prev);
                newModifiers.set(e.code, true);
                return newModifiers;
            });
        });

        window.addEventListener('keyup', (e) => {
            setCurrentModifierButtons(prev => {
                const newModifiers = new Map(prev);
                newModifiers.set(e.code, false);
                return newModifiers;
            });
        });
    }, []);

    return (
        <Box>
            <RenderingCanvas
                $isMouseDragging={lastMouseButton !== -1}
                $isSpaceBarPressed={currentModifierButtons.get('Space') ?? false}
                ref={canvasRef}
                id="canvas"
                data-testid="EngineView.canvas"
                width={width}
                height={height}
                onMouseDown={(e) => {
                    setLastMouseButton(e.button);
                    onMouseDown?.(mouseEventToMouseClickEvent(e.nativeEvent));
                }}
                onMouseUp={() => { setLastMouseButton(-1); setIsMouseDragging(false); }}
                onMouseMove={(e) => {
                    const wasMouseDragging = isMouseDragging;
                    const currentIsMouseDragging = lastMouseButton !== -1 && true;

                    if (!wasMouseDragging && currentIsMouseDragging) {
                        setIsMouseDragging(true);

                        onMouseDragStart?.(mouseEventToMouseDragEvent(e.nativeEvent, currentModifierButtons));
                        return;
                    }

                    currentIsMouseDragging && onMouseDragging?.(mouseEventToMouseDragEvent(e.nativeEvent, currentModifierButtons));
                }}
                onClick={(e) => !isMouseDragging && onClick?.(mouseEventToMouseClickEvent(e.nativeEvent))}
            ></RenderingCanvas>
        </Box>
    )
}, () => true);