import styled from "styled-components";
import { BackgroundColor, TextColor } from "./colors";
import { Spacing } from "./spacing";

interface BoxProps {
    $size?: number;
    $spacing?: Spacing
}

export const Box = styled.div<BoxProps>`
    flex: ${props => props.$size ?? 1};
    color: ${TextColor.Primary};
    background: ${BackgroundColor.Primary};

    ${props => props.$spacing? `padding: ${props.$spacing}`: ''}
`;