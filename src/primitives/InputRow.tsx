import styled from "styled-components";
import { FlexBox } from "./FlexBox";

export const InputRow = styled(FlexBox)`
    &+${FlexBox} {
        margin-top: 5px;
    }
`