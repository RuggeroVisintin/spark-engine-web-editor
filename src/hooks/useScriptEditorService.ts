import { useState } from "react";
import { ReactStateRepository } from "../core/editor"
import { ScriptEditorService, ScriptEditorState } from "../core/scripting/application"
import { EventBusWithBrowserBroadcast } from "../core/scripting/infrastructure";
import { useAppState } from "./useAppState";

export const useScriptEditorService = (): [ScriptEditorService, ScriptEditorState] => {
    const [stateRepo] = useState(new ReactStateRepository<ScriptEditorState>());

    const [appState] = useAppState(stateRepo);

    const [service] = useState(
        new ScriptEditorService(
            new EventBusWithBrowserBroadcast("scripting"),
            'test-entity-uuid',
            stateRepo
        )
    );

    return [
        service,
        appState
    ]
}