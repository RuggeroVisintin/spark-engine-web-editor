import styled from 'styled-components';

interface FlexBoxProps {
    $direction?: 'column' | 'row';
}

export const FlexBox = styled.div<FlexBoxProps>`
    display: flex;
    flex-direction: ${props => props.$direction ?? 'column'};
    height: 100%;
`