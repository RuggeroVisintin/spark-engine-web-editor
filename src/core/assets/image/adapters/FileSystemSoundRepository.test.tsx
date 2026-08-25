import { SoundAsset } from "@sparkengine";
import { createDirectoryHandleMock, FileSystemWritableFileStreamMock, setMockedFile } from "../../../../__mocks__/fs-api.mock";
import { WeakRef } from "../../../common";
import { FileSystemSoundRepository } from "./FileSystemSoundRepository";

describeClass(FileSystemSoundRepository, ({ describeMethod }) => { 
    let fileSystemSoundRepository: FileSystemSoundRepository;
    
        beforeEach(() => {
            fileSystemSoundRepository = new FileSystemSoundRepository(
                new WeakRef(createDirectoryHandleMock())
            );
        });
    
    describeMethod('load', () => { 
        it('Should load a sound within the given project scope from the file system from the source path when given', async () => {
            const result = await fileSystemSoundRepository.load('assets/test.mp3');

            expect(result).toBeInstanceOf(SoundAsset);
        });

        it('Should open a file picker when no source path is given', async () => {
            setMockedFile('assets/test.mp3');
            
            const result = await fileSystemSoundRepository.load();

            expect(result).toBeInstanceOf(SoundAsset);
        });

        it('Should throw an error when trying to open a sound without a project scope', async () => {
            const fileSystemSoundRepository = new FileSystemSoundRepository();

            await expect(async () => { await fileSystemSoundRepository.load('assets/test.mp3') })
                .rejects
                .toThrow('No project scope provided');
        });
    });

    describeMethod('save', () => { 
        const audioBlob = new Blob(['mock audio data'], { type: 'audio/mp3' });

        beforeEach(() => { 
            global.fetch = jest.fn().mockResolvedValue({
                blob: async () => audioBlob
            } as Response);
        })

        it('Should save a given SoundAsset to the given path within the project scope', async () => {
            const asset = new SoundAsset(new Audio());

            await fileSystemSoundRepository.save(asset, { path: 'assets/test.mp3', accessScope: new WeakRef(createDirectoryHandleMock()) });

            expect(FileSystemWritableFileStreamMock.write).toHaveBeenCalledWith({
                type: 'write',
                data: audioBlob,
            });
        });
    });
});