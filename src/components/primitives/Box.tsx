import styled from "styled-components";

interface BoxProps {
    $size?: number;
}

export const Box = styled.div<BoxProps>`
    flex: ${props => props.$size ?? 1};
`;