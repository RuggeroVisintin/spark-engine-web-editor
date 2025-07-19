beforeEach(() => {
    class MockBroadcastChannel {
        name: string;
        onmessage: ((this: BroadcastChannel, ev: MessageEvent) => any) | null = null;
        onmessageerror: ((this: BroadcastChannel, ev: MessageEvent) => any) | null = null;
        postMessage = jest.fn();
        close = jest.fn();
        addEventListener = jest.fn();
        removeEventListener = jest.fn();
        dispatchEvent = jest.fn();
        constructor(name: string) {
            this.name = name;
        }
    }
    global.BroadcastChannel = MockBroadcastChannel as any;
});

