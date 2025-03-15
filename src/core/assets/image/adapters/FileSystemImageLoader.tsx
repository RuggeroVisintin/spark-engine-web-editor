import { FileLocation, ImageAsset, ImageLoader } from "@sparkengine";
import { WeakRef } from "../../../../common";
import { FileSystemRepository } from "../../../common";

export class FileSystemImageLoader extends FileSystemRepository implements ImageLoader {
    constructor(
        private projectScope: WeakRef<FileSystemDirectoryHandle>
    ) {
        super();
    }

    public async load(fileLoaction: FileLocation): Promise<ImageAsset> {
        const fileHandle = await this.getTargetFileHandle({
            path: fileLoaction.src,
            accessScope: this.projectScope
        });

        return new ImageAsset(await createImageBitmap(await fileHandle.getFile()), fileHandle.name.split('.').pop() ?? '');
    }

    public changeScope(scope: WeakRef<FileSystemDirectoryHandle>): void {
        this.projectScope = scope;
    }
}