import styled from 'styled-components';

interface FlexBoxProps {
    $direction?: 'column' | 'row';
    $centerItems?: boolean;
}

export const FlexBox = styled.div<FlexBoxProps>`
    display: flex;
    flex-direction: ${props => props.$direction ?? 'column'};
    height: 100%;

    align-items: ${props => props.$centerItems ? 'center' : 'unset'}
`