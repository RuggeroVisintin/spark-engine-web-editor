import { GameEngine, Scene } from "sparkengineweb";
import { RefConfigParams, SceneRepository } from "../ports";
import { WeakRef } from "../../../common";

interface LocationParameters extends RefConfigParams {
    accessScope: WeakRef<FileSystemDirectoryHandle>;
    path: string;
}

export class FileSystemSceneRepository implements SceneRepository {
    constructor(private readonly factory: GameEngine) { }

    public async read(location?: LocationParameters): Promise<Scene> {
        let fileHandle;

        if (location) {
            fileHandle = await this.getTargetFileHandle(location);
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

        const result = this.factory.createScene();
        result.loadFromJson(JSON.parse(await (await fileHandle.getFile()).text()));

        return result;
    }

    public async save(scene: Scene, location?: LocationParameters): Promise<void> {
        let fileHandle;

        if (location) {
            fileHandle = await this.getTargetFileHandle(location, true);
        } else {
            fileHandle = await window.showSaveFilePicker({
                types: [{
                    accept: {
                        'application/json': ['.spark.json']
                    }
                }]
            });
        }

        const writable = await fileHandle.createWritable();
        await writable.write(JSON.stringify(scene.toJson()));
        await writable.close();
    }

    private async getTargetFileHandle(location: LocationParameters, shouldCreate = false): Promise<FileSystemFileHandle> {
        let currentScope = location.accessScope.get();

        const directories = location.path.split('/');
        const filename = directories.pop();

        for (let i = 0; i < directories.length; i++) {
            currentScope = await currentScope.getDirectoryHandle(directories[i], { create: false });
        }

        return await currentScope.getFileHandle(filename ?? '', {
            create: shouldCreate
        });
    }
}