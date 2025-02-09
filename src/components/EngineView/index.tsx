import React, { memo, useEffect, useRef } from 'react';
import { Box } from '../../primitives';
import * as SparkEngine from '@sparkengine';
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
    const width = 1920;
    const height = 1080;

    useEffect(() => {
        if (!!canvasRef.current && !isEngineInit) {
            const engine = new SparkEngine.GameEngine({
                framerate: 60,
                context: canvasRef.current.getContext('2d')!,
                resolution: { width, height }
            });

            onEngineReady(engine);
            isEngineInit = true;
        }
    }, [canvasRef, onEngineReady]);

    return (
        <Box>
            <RenderingCanvas ref={canvasRef} id="canvas" width={width} height={height}></RenderingCanvas>
        </Box>
    )
}, () => true);