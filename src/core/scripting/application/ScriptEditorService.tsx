import { Optional } from "../../common";
import { StateRepository } from "../../common/StateRepository";
import { OpenScriptingEditorCommand } from "../domain/commands/OpenScriptingEditor";
import { EventBus } from "./ports/EventBus";
import { ScriptEditorState } from "./ScriptEditorState";


export class ScriptEditorService {
    private _currentScript: Optional<string>;

    get currentScript(): Optional<string> {
        return this._currentScript;
    }

    constructor(
        private readonly eventBus: EventBus,
        private readonly entityUuid: string,
        private readonly state: StateRepository<ScriptEditorState>
    ) {
        this.eventBus.subscribe<OpenScriptingEditorCommand>('OpenScriptingEditorCommand', this.handle.bind(this));
    }

    private handle(message: OpenScriptingEditorCommand): void {
        console.log('handle message', message)

        if (message.entityUuid !== this.entityUuid) {
            return;
        }

        this._currentScript = message.currentScript;

        this.state.update({
            currentScript: this._currentScript
        });
    }
}