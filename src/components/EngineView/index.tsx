import React, { memo, useEffect, useRef } from 'react';
import { Box } from '../../primitives';
import * as SparkEngine from 'sparkengineweb';
import styled from 'styled-components';

interface EngineViewProps {
    onEngineReady: Function
}

const RenderingCanvas = styled.canvas({
    width: '100%',
    background: 'black'
})

let isEngineInit = false;

export const EngineView = memo(({ onEngineReady }: EngineViewProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!!canvasRef.current && !isEngineInit) {
            const engine = new SparkEngine.GameEngine({
                framerate: 60,
                context: canvasRef.current.getContext('2d')!,
                resolution: { width: 1920, height: 1080 }
            });

            onEngineReady(engine);
            isEngineInit = true;
        }
    }, [canvasRef]);

    return (
        <Box>
            <RenderingCanvas ref={canvasRef} id="canvas"></RenderingCanvas>
        </Box>
    )
}, () => true);