import styled from 'styled-components';

interface FlexBoxProps {
    $direction?: 'column' | 'row';
    $centerItems?: boolean;
    $fill?: boolean;
}

export const FlexBox = styled.div<FlexBoxProps>`
    display: flex;
    flex-direction: ${props => props.$direction ?? 'column'};
    align-items: ${props => props.$centerItems ? 'center' : 'unset'};

    ${props => props.$fill && `height: 100%;`}
`