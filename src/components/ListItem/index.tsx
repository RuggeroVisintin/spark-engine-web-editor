import React, { MouseEventHandler } from "react";
import { BackgroundColor, Box, FlexBox } from "../../primitives";
import styled from "styled-components";

interface ListItemProps {
    text?: string;
    onClick?: MouseEventHandler<HTMLElement>;
}

const ItemWrapper = styled(Box)`
    padding: 10px 10px;
    margin: 2px 10px;
    border-radius: 5px;
    
    &:hover {
        background: ${BackgroundColor.Accents};
    }
`

const ImageBox = styled(Box)`
    max-width: 40px;
    height: 40px;

    background: ${BackgroundColor.Secondary}
`

const Text = styled.span`
    line-height: 1;
    vertical-align: middle;
    margin-left: 15px;
`

export const ListItem = ({ text, onClick }: ListItemProps) => {
    return (
        <ItemWrapper
            onClick={(mouseEvent) => onClick && onClick(mouseEvent)}
        >
            <FlexBox $direction="row" $centerItems>
                <ImageBox />
                <Text>{text}</Text>
            </FlexBox>
        </ItemWrapper>
    );
}