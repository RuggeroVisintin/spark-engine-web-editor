import { ReactStateRepository } from "../../editor";
import { OpenScriptingEditorCommand } from "../domain/commands";
import { EventBus } from "./ports/EventBus";
import { ScriptEditorService } from "./ScriptEditorService";
import { ScriptEditorState } from "./ScriptEditorState";

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
    let state: ReactStateRepository<ScriptEditorState>;

    beforeEach(() => {
        eventBus = new InMemoryEventBusDouble();
        state = new ReactStateRepository<ScriptEditorState>();
        service = new ScriptEditorService(eventBus, entityUuid, state);
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

        it('Should trigger a state update', () => {
            const command: OpenScriptingEditorCommand = {
                entityUuid: 'test-entity-uuid',
                currentScript: 'console.log("Hello World");',
            };

            const cb = jest.fn();
            state.subscribe(cb)

            eventBus.publish('OpenScriptingEditorCommand', command);

            expect(cb).toHaveBeenCalledWith({
                currentScript: 'console.log("Hello World");',
            });
        })
    });

    describe('.onEditorReady', () => {
        it('Should emit an ScriptingEditorReady event', () => {
            const cb = jest.fn();
            eventBus.subscribe('ScriptingEditorReady', cb);

            service.onEditorReady();

            expect(cb).toHaveBeenCalledWith({ entityUuid });
        })
    })
});