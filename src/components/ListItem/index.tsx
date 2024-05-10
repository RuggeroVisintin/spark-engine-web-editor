import React, { MouseEventHandler } from "react";
import { BackgroundColor, Box, FlexBox } from "../../primitives";
import styled from "styled-components";
import { WithDataTestId } from "../../common";

interface ListItemProps extends WithDataTestId {
    text?: string;
    onClick?: MouseEventHandler<HTMLElement>;
    imgSrc?: string;
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

export const ListItem = ({
    text,
    onClick,
    imgSrc,
    'data-testid': dataTestId
}: ListItemProps) => {
    return (
        <ItemWrapper
            onClick={(mouseEvent) => onClick && onClick(mouseEvent)}
            data-testid={dataTestId}
        >
            <FlexBox $direction="row" $centerItems>
                {imgSrc && <ImageBox />}
                <Text>{text}</Text>
            </FlexBox>
        </ItemWrapper>
    );
}