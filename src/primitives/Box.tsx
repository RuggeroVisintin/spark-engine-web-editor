import styled from "styled-components";
import { BackgroundColor, TextColor } from "./colors";

interface BoxProps {
    $size?: number;
    $highlight?: boolean;
}

export const Box = styled.div<BoxProps>`
    flex: ${props => props.$size ?? 1};
    background: ${props => props.$highlight ? BackgroundColor.Accents : BackgroundColor.Primary};
    color: ${TextColor.Primary};
    transition: 0.15s ease;
`;