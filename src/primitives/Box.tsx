import styled from "styled-components";
import { BackgroundColor, TextColor } from "../components/common/colors";

interface BoxProps {
    $size?: number;
}

export const Box = styled.div<BoxProps>`
    flex: ${props => props.$size ?? 1};
    background: ${BackgroundColor.Primary};
    color: ${TextColor.Primary}
`;