
import React from "react";
import { PopupMenu } from "../../components/PopupMenu";
import { BackgroundColor, FlexBox, TextColor } from "../../primitives";



export const ActionMenu = () => {
    return (
        <FlexBox style={{ height: '40px', background: BackgroundColor.Primary, borderBottom: `1px solid ${TextColor.Primary}` }} $direction='row'>
            <PopupMenu label="File" items={[{
                label: 'Open'
            }, {
                label: 'Save'
            }]}></PopupMenu>
        </FlexBox>
    )
}