import React from "react";
import { PopupMenu } from "../../components/PopupMenu";
import { BackgroundColor, FlexBox, TextColor } from "../../primitives";
import { Function } from "../../common";

export interface ActionMenuProps {
    onProjectFileOpen: Function<FileSystemFileHandle>;
    onProjectFileSave: Function<FileSystemFileHandle>;
}

export const ActionMenu = (props: ActionMenuProps) => {
    const onOpenProjectFile = async () => {
        try {
            const [openFileHandle] = await window.showOpenFilePicker({
                multiple: false,
                types: [{
                    accept: {
                        'application/json': ['.spark.json']
                    }
                }]
            });

            props.onProjectFileOpen(openFileHandle);
        } catch (err) {
        }
    }

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
                    action: () => onOpenProjectFile()
                }, {
                    label: 'Save',
                    action: () => onSaveProjectFile()
                }]}
            />
        </FlexBox>
    )
}