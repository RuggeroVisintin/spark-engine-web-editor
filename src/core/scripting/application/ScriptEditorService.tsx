import { Optional } from "../../common";
import { OpenScriptingEditorCommand } from "../domain/commands/OpenScriptingEditor";
import { EventBus } from "./ports/EventBus";


export class ScriptEditorService {
    private _currentScript: Optional<string>;

    get currentScript(): Optional<string> {
        return this._currentScript;
    }

    constructor(
        private readonly eventBus: EventBus,
        private readonly entityUuid: string
    ) {
        this.eventBus.subscribe<OpenScriptingEditorCommand>('OpenScriptingEditorCommand', this.handle.bind(this));
    }

    private handle(message: OpenScriptingEditorCommand): void {
        console.log('handle message', message)

        if (message.entityUuid !== this.entityUuid) {
            return;
        }

        this._currentScript = message.currentScript;
    }
}