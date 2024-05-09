import React, { useEffect, useRef } from 'react';
import { Box } from '../../primitives';
import * as SparkEngine from 'sparkengineweb';
import styled from 'styled-components';

interface EngineViewProps {
    onEngineReady: Function
}

const RenderingCanvas = styled.canvas({
    width: '100%',
    height: '100%',
    background: 'black'
})

export const EngineView = ({ onEngineReady }: EngineViewProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (canvasRef.current !== null) {
            const engine = new SparkEngine.GameEngine({
                framerate: 60,
                context: canvasRef.current.getContext('2d')!,
                resolution: { width: 1920, height: 1080 }
            });

            onEngineReady(engine);
        }
    }, [onEngineReady]);

    return (
        <Box>
            <RenderingCanvas ref={canvasRef} id="canvas"></RenderingCanvas>
        </Box>
    )
}