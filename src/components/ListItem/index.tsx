import React, { MouseEventHandler } from "react";
import { BackgroundColor, Box, FlexBox } from "../../primitives";
import styled from "styled-components";
import { WithDataTestId } from "../../common";

const ItemWrapper = styled(Box)`
    padding: 10px 10px;
    margin: 2px 0px;
    border-radius: 5px;
    
    &:hover {
        background: ${BackgroundColor.Accents};
    }
`

const ImageBox = styled(Box)`
    max-width: 40px;
    height: 40px;
    margin-right: 15px;

    background: ${BackgroundColor.Secondary}
`

const Text = styled.span`
    line-height: 1;
    vertical-align: middle;
    flex: 1;
`

const ActionButton = styled.button`
`;

interface ListButton extends WithDataTestId {
    text?: string,
    onClick?: CallableFunction
}
interface ListItemProps extends WithDataTestId {
    text?: string;
    onClick?: MouseEventHandler<HTMLElement>;
    imgSrc?: string;
    button?: ListButton
}

export const ListItem = ({
    text,
    onClick,
    imgSrc,
    'data-testid': dataTestId,
    button
}: ListItemProps) => {
    return (
        <ItemWrapper
            onClick={(mouseEvent) => onClick && onClick(mouseEvent)}
            data-testid={dataTestId}
        >
            <FlexBox $direction="row" $centerItems>
                {imgSrc && <ImageBox />}
                <Text>{text}</Text>
                {button &&
                    <ActionButton
                        onClick={() => button.onClick && button.onClick()}
                        data-testid={button["data-testid"]}
                    >
                        {button.text}
                    </ActionButton>
                }
            </FlexBox>
        </ItemWrapper>
    );
}