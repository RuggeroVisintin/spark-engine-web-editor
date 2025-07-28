import { useState } from "react";
import { ReactStateRepository } from "../core/editor"
import { ScriptEditorService, ScriptEditorState } from "../core/scripting/application"
import { EventBusWithBrowserBroadcast } from "../core/scripting/infrastructure";
import { useAppState } from "./useAppState";

export const useScriptEditorService = (currentEntityUuid: string): [ScriptEditorService, ScriptEditorState] => {
    const [stateRepo] = useState(() => new ReactStateRepository<ScriptEditorState>());
    const [appState] = useAppState(stateRepo);

    const [service] = useState(() =>
        new ScriptEditorService(
            new EventBusWithBrowserBroadcast("scripting"),
            currentEntityUuid,
            stateRepo
        )
    );

    return [
        service,
        appState
    ]
}