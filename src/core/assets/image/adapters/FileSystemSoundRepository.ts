import { SoundAsset, SoundLoader } from "@sparkengine";
import { SoundRepository } from "../ports";
import { FileSystemRepository, FileSystemLocationParameters, WeakRef } from "../../../common";

export class FileSystemSoundRepository extends FileSystemRepository implements SoundLoader, SoundRepository {
    constructor(private projectScope?: WeakRef<FileSystemDirectoryHandle>) {
        super();
    }

    public async load(src?: string): Promise<SoundAsset> {
        let fileHandle: FileSystemFileHandle;

        if (!src) {
            [fileHandle] = await window.showOpenFilePicker({
                multiple: false,
                types: [{
                    accept: {
                        'audio/*': ['.mp3', '.wav', '.ogg']
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

        const file = await fileHandle.getFile();
        const audio = new Audio(URL.createObjectURL(file));

        return new SoundAsset(audio);
    }

    save(sound: SoundAsset, location: FileSystemLocationParameters): Promise<void> {
        throw new Error("Method not implemented.");
    }
    changeScope(scopeRef: WeakRef): void {
        throw new Error("Method not implemented.");
    }

}