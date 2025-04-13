import { ImageAsset, ImageLoader } from "@sparkengine";
import { WeakRef } from "../../../../common";
import { FileSystemRepository } from "../../../common";

export class FileSystemImageRepository extends FileSystemRepository implements ImageLoader {
    constructor(
        private projectScope?: WeakRef<FileSystemDirectoryHandle>
    ) {
        super();
    }

    public async save(ImageAsset: ImageAsset, src: string): Promise<void> {
        const fileHandle = await this.getTargetFileHandle({
            path: src,
            accessScope: this.projectScope!
        }, true);

        const writable = await fileHandle.createWritable();
        await writable.write({
            type: 'write',
            data: new Blob([ImageAsset.media.toString()], { type: `image/${ImageAsset.type}` })
        });
        await writable.close();
    }

    public async load(src?: string): Promise<ImageAsset> {
        let fileHandle: FileSystemFileHandle;

        if (!src) {
            [fileHandle] = await window.showOpenFilePicker({
                multiple: false,
                types: [{
                    accept: {
                        'image/*': ['.png', '.jpg', '.jpeg', '.gif']
                    }
                }]
            });
        } else {
            if (!this.projectScope) {
                throw new Error('No project scope provided');
            }

            fileHandle = await this.getTargetFileHandle({
                path: src,
                accessScope: this.projectScope
            });
        }

        return new ImageAsset(await createImageBitmap(await fileHandle.getFile()), fileHandle.name.split('.').pop() ?? '');
    }

    public changeScope(scope: WeakRef<FileSystemDirectoryHandle>): void {
        this.projectScope = scope;
    }
}