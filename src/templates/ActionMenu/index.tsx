import React from "react";
import { PopupMenu } from "../../components/PopupMenu";
import { BackgroundColor, FlexBox, TextColor } from "../../primitives";
import { Function } from "../../common";

export interface ActionMenuProps {
    onProjectFileOpen: Function;
    onProjectFileSave: Function<FileSystemFileHandle>;
}

export const ActionMenu = (props: ActionMenuProps) => {
    const onSaveProjectFile = async () => {
        try {
            const saveFileHandle = await window.showSaveFilePicker({
                types: [{
                    accept: {
                        'application/json': ['.spark.json']
                    }
                }]
            });
            props.onProjectFileSave(saveFileHandle);
        } catch (err) {
        }
    }

    return (
        <FlexBox style={{ height: '40px', background: BackgroundColor.Primary, borderBottom: `1px solid ${TextColor.Primary}` }}
            $direction='row'>
            <PopupMenu
                data-testid="action-menu.file"
                label="File"
                items={[{
                    label: 'Open',
                    action: props.onProjectFileOpen
                }, {
                    label: 'Save',
                    action: () => onSaveProjectFile()
                }]}
            />
        </FlexBox>
    )
}