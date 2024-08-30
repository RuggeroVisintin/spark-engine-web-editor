let __mockedFileBody = '';

export function setMockedFile(mockedFileBody: string) {
    __mockedFileBody = mockedFileBody;
};

export const FileSystemWritableFileStreamMock = {
    write: jest.fn(),
    close: jest.fn()
}

beforeEach(() => {
    setMockedFile('{}');

    global.showOpenFilePicker = jest.fn().mockResolvedValue([
        { kind: 'file', name: 'open-test', getFile: jest.fn().mockResolvedValue({ text: jest.fn(() => Promise.resolve(__mockedFileBody)) }) }
    ]);

    global.showSaveFilePicker = jest.fn().mockResolvedValue({
        kind: 'file', name: 'save-test', createWritable: jest.fn().mockResolvedValue(FileSystemWritableFileStreamMock)
    })
}) 
