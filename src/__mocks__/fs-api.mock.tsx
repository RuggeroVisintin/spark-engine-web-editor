beforeEach(() => {
    global.showOpenFilePicker = jest.fn().mockResolvedValue([
        { kind: 'file', name: 'test' }
    ])
}) 
