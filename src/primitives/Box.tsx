import styled from "styled-components";
import { BackgroundColor, TextColor } from "./colors";

interface BoxProps {
    $size?: number;
}

export const Box = styled.div<BoxProps>`
    flex: ${props => props.$size ?? 1};
    color: ${TextColor.Primary};
    background: ${BackgroundColor.Primary};
`;