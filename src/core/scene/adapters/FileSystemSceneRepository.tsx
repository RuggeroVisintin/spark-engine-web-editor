import { GameEngine, Scene } from "sparkengineweb";
import { SceneRepository } from "../ports";
import { WeakRef } from "../../../common";

interface RefConfigParams {
    accessScope: WeakRef<FileSystemDirectoryHandle>;
    path: string;
}

export class FileSystemSceneRepository implements SceneRepository {
    constructor(private readonly factory: GameEngine) { }

    public async read(scopeRef?: RefConfigParams): Promise<Scene> {
        let fileHandle;

        if (scopeRef) {
            let currentScope = scopeRef.accessScope.get();

            const directories = scopeRef.path.split('/');
            const filename = directories.pop();

            for (let i = 0; i < directories.length; i++) {
                currentScope = await currentScope.getDirectoryHandle(directories[i], { create: false });
            }

            fileHandle = await currentScope.getFileHandle(filename ?? '', {
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

        const result = this.factory.createScene();
        result.loadFromJson(JSON.parse(await (await fileHandle.getFile()).text()));

        return result;
    }

    public async save(scene: Scene): Promise<void> {
        const fileHandle = await window.showSaveFilePicker({
            types: [{
                accept: {
                    'application/json': ['.spark.json']
                }
            }]
        });

        const writable = await fileHandle.createWritable();
        await writable.write(JSON.stringify(scene.toJson()));
        await writable.close();
    }
}