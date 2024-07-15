import React from "react";
import { PopupMenu } from "../../components/PopupMenu";
import { BackgroundColor, FlexBox, TextColor } from "../../primitives";

export interface ActionMenuProps {
    onFileOpen: CallableFunction;
    onFileSave: CallableFunction;
}

export const ActionMenu = (props: ActionMenuProps) => {
    const readSceneFile = async () => {
        try {
            const [openFileHandle] = await window.showOpenFilePicker({
                multiple: false,
                types: [{
                    accept: {
                        'application/json': ['.json']
                    }
                }]
            });

            props.onFileOpen(openFileHandle);
        } catch (err) {
        }
    }

    const saveSceneFile = async () => {
        try {
            const saveFileHandle = await window.showSaveFilePicker({
                types: [{
                    accept: {
                        'application/json': ['.json']
                    }
                }]
            });
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
                    action: () => readSceneFile()
                }, {
                    label: 'Save',
                    action: () => saveSceneFile()
                }]}
            />
        </FlexBox>
    )
}