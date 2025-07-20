import { Optional } from "../core/common";

let currentBroadcastChannel: Optional<TestBroadcastChannel>;

class TestBroadcastChannel {
    private callbacks = new Map<string, ((message: MessageEvent) => void)[]>();

    name: string;
    onmessage: ((this: BroadcastChannel, ev: MessageEvent) => any) | null = null;
    onmessageerror: ((this: BroadcastChannel, ev: MessageEvent) => any) | null = null;
    postMessage = jest.fn((message: any) => {
        const event = { data: message } as MessageEvent;
        this.callbacks.get('message')?.forEach(callback => callback(event));
    });
    close = jest.fn();
    addEventListener = jest.fn((name: string, callback: (message: MessageEvent) => void) => {
        this.callbacks.set(name, [...(this.callbacks.get(name) || []), callback]);
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

