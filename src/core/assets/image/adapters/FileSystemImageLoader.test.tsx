import { ImageAsset } from "@sparkengine";
import { WeakRef } from "../../../../common";
import { FileSystemImageLoader } from "./FileSystemImageLoader";
import { createDirectoryHandleMock } from "../../../../__mocks__/fs-api.mock";

describe('core/assets/image/adapters/FileSystemImageLoader', () => {
    describe('.load()', () => {
        it('Should load an image within the given project scope from the file system', async () => {
            const loader = new FileSystemImageLoader(
                new WeakRef(createDirectoryHandleMock())
            );

            const result = await loader.load({ src: 'assets/test.png' });

            expect(result).toBeInstanceOf(ImageAsset);
        });
    });

    describe('.changeScope()', () => {
        it('Should change the project scope', async () => {
            const loader = new FileSystemImageLoader(
                new WeakRef(createDirectoryHandleMock())
            );

            loader.changeScope(new WeakRef(createDirectoryHandleMock({
                getFileHandle: jest.fn(() => { throw new Error('File not found') })
            })));

            await expect(async () => { await loader.load({ src: 'assets/test.png' }) })
                .rejects
                .toThrow('File not found');
        })
    })
});