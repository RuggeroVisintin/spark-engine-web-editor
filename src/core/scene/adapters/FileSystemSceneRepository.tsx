import { Scene } from "@sparkengine";
import { SceneRepository } from "../ports";
import { FileSystemRepository, LocationParameters } from "../../common";

export class FileSystemSceneRepository extends FileSystemRepository implements SceneRepository {
    constructor() {
        super();
    }

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

        const result = new Scene();
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
}