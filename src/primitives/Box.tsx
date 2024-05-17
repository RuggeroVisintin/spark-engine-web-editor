import styled from "styled-components";
import { BackgroundColor, TextColor } from "./colors";
import { Spacing } from "./spacing";

interface BoxProps {
    $size?: number;
    $spacing?: Spacing
    $background?: string;
    $scroll?: boolean;
    $divide?: boolean;
}

export const Box = styled.div<BoxProps>`
    flex: ${props => props.$size ?? 1};
    color: ${TextColor.Primary};
    background: ${props => props.$background ?? BackgroundColor.Primary};

    ${props => props.$spacing && `padding: ${props.$spacing};`}
    ${props => props.$scroll && 'overflow: auto;'}

    ${props => props.$divide && 'border-top: 1px solid;'}
`;