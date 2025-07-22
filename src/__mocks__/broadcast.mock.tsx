import { Optional } from "../core/common";

let currentBroadcastChannel: Optional<TestBroadcastChannel>;

class TestBroadcastChannel implements BroadcastChannel {
    private callbacks = new Map<string, ((message: MessageEvent) => void)[]>();

    name: string;
    onmessage: ((this: BroadcastChannel, ev: MessageEvent) => any) | null = null;
    onmessageerror: ((this: BroadcastChannel, ev: MessageEvent) => any) | null = null;
    postMessage = jest.fn((message: any) => {
        const event = { data: message } as MessageEvent;
        this.callbacks.get('message')?.forEach(callback => callback(event));
    });
    close = jest.fn();
    addEventListener: BroadcastChannel['addEventListener'] = jest.fn(function (
        type: string,
        listener: EventListenerOrEventListenerObject,
        options?: boolean | AddEventListenerOptions
    ) {
        // Only handle 'message' event for this mock
        if (type === 'message') {
            let callback: (message: MessageEvent) => void;
            if (typeof listener === 'function') {
                callback = listener as (message: MessageEvent) => void;
            } else {
                callback = (ev: MessageEvent) => listener.handleEvent(ev);
            }
            this.callbacks.set(type, [...(this.callbacks.get(type) || []), callback]);
        }
    });
    removeEventListener = jest.fn();
    dispatchEvent = jest.fn();

    constructor(name: string) {
        currentBroadcastChannel = this;
        this.name = name;
    }
}

export const getTestBroadcastChannel = (): Optional<TestBroadcastChannel> => {
    return currentBroadcastChannel;
}

beforeEach(() => {
    global.BroadcastChannel = TestBroadcastChannel;
});

