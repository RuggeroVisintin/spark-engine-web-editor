import { SoundAsset, SoundLoader } from "@sparkengine";
import { SoundRepository } from "../ports";
import { FileSystemRepository, LocationParameters, WeakRef } from "../../../common";

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
                accessScope: this.projectScope!
            });
        }

        const audio = new Audio(URL.createObjectURL(await fileHandle.getFile()));

        Object.defineProperty(audio, 'src', {
            get: () => src!, // When SoundComponent reads audio.src, it gets your virtual path
            configurable: true
        });

        return new SoundAsset(audio);
    }

    save(sound: SoundAsset, location: LocationParameters): Promise<void> {
        throw new Error("Method not implemented.");
    }
    changeScope(scopeRef: WeakRef): void {
        throw new Error("Method not implemented.");
    }

}