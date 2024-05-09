import React, { MouseEventHandler, useState } from "react";
import { BackgroundColor, Box } from "../../primitives";

interface ListItemProps {
    text?: string;
    onClick?: MouseEventHandler<HTMLElement>;
}

export const ListItem = ({ text, onClick }: ListItemProps) => {
    const [hover, setHover] = useState(false);

    const onClickCB = (event: any) => { 
        onClick && onClick(event);
    };

    return (
        <Box
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            $highlight={hover}
            style={{ padding: '20px'}}
            onClick={onClickCB}
        >{text}</Box>
    );
}