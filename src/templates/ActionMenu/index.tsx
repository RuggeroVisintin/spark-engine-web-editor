
import React from "react";
import styled from "styled-components";
import { ListItem } from "../../components";
import { BackgroundColor, FlexBox, TextColor } from "../../primitives";

const MenuItem = styled(ListItem)`
    display: block;
`

export const ActionMenu = () => {
    return (
        <FlexBox style={{ height: '40px', background: BackgroundColor.Primary, borderBottom: `1px solid ${TextColor.Primary}` }} $direction='row'>
            <MenuItem text="File" flex={false} />
        </FlexBox>
    )
}