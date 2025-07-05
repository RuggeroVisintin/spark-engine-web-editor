import { useEffect, useState } from "react";
import { ReactStateRepository } from "../core/editor";
import { EditorState } from "../core/editor/application/StateRepository";

export const useEditorState = (repository: ReactStateRepository): [EditorState] => {
    const [state, setState] = useState({});

    useEffect(() => {
        return repository.subscribe(setState);
    }, [repository]);

    return [state];
};