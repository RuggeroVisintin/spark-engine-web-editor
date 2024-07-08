import React from "react"
import { ListItem } from "../../components"
import { FlexBox } from "../../primitives"

export const PopupMenu = () => {
    return (
        <FlexBox style={{ minWidth: 200 }}>
            <ListItem text="Open" />
            <ListItem text="Save"/>
        </FlexBox>
    )
}