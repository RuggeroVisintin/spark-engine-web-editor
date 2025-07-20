import { OpenScriptingEditorCommand } from "../domain/commands";
import { EventBus } from "./ports/EventBus";
import { ScriptEditorService } from "./ScriptEditorService";

class InMemoryEventBusDouble implements EventBus {
    private subscribers: { [key: string]: ((event: any) => void)[] } = {};

    subscribe<T>(eventName: string, callback: (event: T) => void): void {
        if (!this.subscribers[eventName]) {
            this.subscribers[eventName] = [];
        }

        this.subscribers[eventName].push(callback);
    }

    publish<T>(eventName: string, event: T): void {
        if (this.subscribers[eventName]) {
            this.subscribers[eventName].forEach(callback => callback(event));
        }
    }
}

describe('core/scripting/application/ScriptEditorService', () => {
    let service: ScriptEditorService;
    let entityUuid = 'test-entity-uuid';
    let eventBus: InMemoryEventBusDouble;

    beforeEach(() => {
        eventBus = new InMemoryEventBusDouble();
        service = new ScriptEditorService(eventBus, entityUuid);
    })

    describe('on OpenScriptingEditorCommand', () => {
        it.each([
            'console.log("Hello World");',
            undefined
        ])('should set the current script when the current entity id matches', (currentScript?: string) => {
            const command: OpenScriptingEditorCommand = {
                entityUuid: 'test-entity-uuid',
                currentScript,
            };

            eventBus.publish('OpenScriptingEditorCommand', command);

            expect(service.currentScript).toBe(currentScript);
        });

        it.each([
            'another-entity-uuid',
            ''
        ])('Should not set current script if entityUuid does not match', (entityUuid: string) => {
            const command: OpenScriptingEditorCommand = {
                entityUuid,
                currentScript: 'console.log("This should not be set");',
            };

            eventBus.publish('OpenScriptingEditorCommand', command);

            expect(service.currentScript).toBe(undefined);
        });
    });
});