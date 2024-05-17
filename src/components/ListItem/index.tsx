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

const ImageBox = styled.img`
    max-width: 40px;
    max-height: 40px;
    margin-right: 15px;

    border-radius: 5px;

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
    onClick?: MouseEventHandler<HTMLElement>
}
interface ListItemProps extends WithDataTestId {
    text?: string;
    onClick?: MouseEventHandler<HTMLElement>;
    imgSrc?: string;
    button?: ListButton;
    isAcitve?: boolean;
}

export const ListItem = ({
    text,
    onClick,
    imgSrc,
    'data-testid': dataTestId,
    button,
    isAcitve
}: ListItemProps) => {
    return (
        <ItemWrapper
            $background={isAcitve ? BackgroundColor.Secondary : undefined}
            onClick={(e) => onClick?.(e)}
            data-testid={dataTestId}
        >
            <FlexBox $direction="row" $centerItems>
                {imgSrc && <ImageBox src={require(`../../assets/images/${imgSrc}`)} alt="img"/>}
                <Text>{text}</Text>
                {button &&
                    <ActionButton
                        onClick={(e) => {
                            button.onClick?.(e);
                        }}
                    	data-testid={button["data-testid"]}
                    >
                    	{button.text}
                    </ActionButton>
                }
            </FlexBox>
        </ItemWrapper>
    );
}