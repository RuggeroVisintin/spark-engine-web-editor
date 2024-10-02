import { SceneJsonProps } from "sparkengineweb";
import { SceneRepository } from "../ports";
import { WeakRef } from "../../../common";

interface RefConfigParams {
    accessScope: WeakRef<FileSystemDirectoryHandle>;
    path: string;
}

export class FileSystemSceneRepository implements SceneRepository {
    public async read(refScope?: RefConfigParams): Promise<SceneJsonProps> {
        let fileHandle;

        if (refScope) {
            fileHandle = await refScope.accessScope.get().getFileHandle(refScope.path, {
                create: false
            })
        } else {
            [fileHandle] = await window.showOpenFilePicker({
                multiple: false,
                types: [{
                    accept: {
                        'application/json': ['.spark.json']
                    }
                }]
            });
        }

        return JSON.parse(await (await fileHandle.getFile()).text());
    }

    public async save(sceneProps: SceneJsonProps): Promise<void> {
        const fileHandle = await window.showSaveFilePicker({
            types: [{
                accept: {
                    'application/json': ['.spark.json']
                }
            }]
        });

        const writable = await fileHandle.createWritable();
        await writable.write(JSON.stringify(sceneProps));
        await writable.close();
    }
}