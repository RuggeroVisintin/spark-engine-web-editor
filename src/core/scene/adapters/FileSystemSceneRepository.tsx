import { GameEngine, Scene } from "sparkengineweb";
import { SceneRepository } from "../ports";

export class FileSystemSceneRepository implements SceneRepository {
    constructor(private readonly factory: GameEngine) { }

    public async read(): Promise<Scene> {
        const [fileHandle] = await window.showOpenFilePicker({
            multiple: false,
            types: [{
                accept: {
                    'application/json': ['.spark.json']
                }
            }]
        });

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