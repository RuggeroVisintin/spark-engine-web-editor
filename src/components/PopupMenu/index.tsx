import React, { useId, useState } from "react";
import styled from "styled-components";
import { WithDataTestId } from "../../core/common";
import { BackgroundColor, FlexBox, Spacing, TextColor } from "../../primitives";
import { ListItem } from "../ListItem";


const PopupMenuBody = styled(FlexBox)`
    margin-top: 40px;
    padding: ${Spacing.xxs} ${Spacing.xs};
    position: absolute;
    min-width: 300px;
    background: ${BackgroundColor.Primary};
    border: 1px solid ${TextColor.Primary};
`;

interface PopupMenuItem {
    label: string;
    action?: CallableFunction;
    items?: PopupMenuItem[];
}

export interface PopupMenuProps extends WithDataTestId, PopupMenuItem { }

export const PopupMenu = (props: PopupMenuProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const id = useId();

    return (
        <>
            <ListItem
                text={props.label}
                flex={false}
                data-testid={`${props["data-testid"]}.trigger`}
                onClick={() => setIsOpen(!isOpen)}
                isAcitve={isOpen} />
            {isOpen && props.items &&
                <PopupMenuBody $direction="column">
                    {
                        props.items.map((item, idx) =>
                            <ListItem
                                text={item.label}
                                onClick={() => { setIsOpen(false); item.action?.() }}
                                key={`${id}.item.${idx}`}
                                data-testid={`${props["data-testid"]}.item`}
                            />
                        )
                    }
                </PopupMenuBody>
            }
        </>
    )
}