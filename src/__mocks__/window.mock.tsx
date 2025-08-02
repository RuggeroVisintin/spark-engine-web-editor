const windows = new Map<string, string>();

export const getWindowCurrentUrl = (target: string | 'default') => windows.get(target);

beforeEach(() => {
    global.window.open = (url?: string | URL, target?: string, features?: string): Window | null => {
        windows.set(target ?? 'default', url?.toString() ?? '/');

        return null;
    };
});
