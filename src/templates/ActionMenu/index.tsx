
import React, { useState } from "react";
import styled from "styled-components";
import { ListItem } from "../../components";
import { PopupMenu } from "../../patterns/PopupMenu";
import { BackgroundColor, FlexBox, TextColor } from "../../primitives";

const MenuItem = styled(ListItem)`
    display: block;
`

export const ActionMenu = () => {
    const [fileMenuOpened, setFileMenuOpened] = useState(false);


    
    return (
        <FlexBox style={{ height: '40px', background: BackgroundColor.Primary, borderBottom: `1px solid ${TextColor.Primary}` }} $direction='row'>
            <MenuItem text="File" flex={false} onClick={() => setFileMenuOpened(true)} />
            { fileMenuOpened && <PopupMenu></PopupMenu> }
        </FlexBox>
    )
}