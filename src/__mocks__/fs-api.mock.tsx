beforeEach(() => {
    global.showOpenFilePicker = jest.fn().mockResolvedValue([
        { kind: 'file', name: 'open-test' }
    ]);

    global.showSaveFilePicker = jest.fn().mockResolvedValue({
        kind: 'file', name: 'save-test'
    })
}) 
