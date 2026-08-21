import { SoundAsset } from "@sparkengine";
import { createDirectoryHandleMock, setMockedFile } from "../../../../__mocks__/fs-api.mock";
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
            expect(result.media.src).toBe('assets/test.mp3');
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
});