import { ImageAsset } from "@sparkengine";
import { WeakRef } from "../../../../common";
import { FileSystemImageLoader } from "./FileSystemImageLoader";
import { createDirectoryHandleMock, setMockedFile } from "../../../../__mocks__/fs-api.mock";

describe('core/assets/image/adapters/FileSystemImageLoader', () => {
    describe('.load()', () => {
        it('Should load an image within the given project scope from the file system from the source path when given', async () => {
            const loader = new FileSystemImageLoader(
                new WeakRef(createDirectoryHandleMock())
            );

            const result = await loader.load('assets/test.png');

            expect(result).toBeInstanceOf(ImageAsset);
        });

        it('Should open a file picker when no source path is given', async () => {
            setMockedFile('assets/test.png');

            const loader = new FileSystemImageLoader(
                new WeakRef(createDirectoryHandleMock())
            );

            const result = await loader.load();

            expect(result).toBeInstanceOf(ImageAsset);
        });

        it('Should throw an error when trying to open an image without a project scope', async () => {
            const loader = new FileSystemImageLoader();

            await expect(async () => { await loader.load('assets/test.png') })
                .rejects
                .toThrow('No project scope provided');
        })
    });

    describe('.changeScope()', () => {
        it('Should change the project scope', async () => {
            const loader = new FileSystemImageLoader(
                new WeakRef(createDirectoryHandleMock())
            );

            loader.changeScope(new WeakRef(createDirectoryHandleMock({
                getFileHandle: jest.fn(() => { throw new Error('File not found') })
            })));

            await expect(async () => { await loader.load('assets/test.png') })
                .rejects
                .toThrow('File not found');
        })
    })
});