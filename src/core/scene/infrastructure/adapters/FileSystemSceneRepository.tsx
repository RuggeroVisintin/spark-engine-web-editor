import { Scene } from "@sparkengine";
import { SceneRepository } from "../../domain";
import { FileSystemRepository, FileSystemLocationParameters, parseJsonString, toJsonString } from "../../../common";

export class FileSystemSceneRepository extends FileSystemRepository implements SceneRepository {
    public async read(location?: FileSystemLocationParameters): Promise<Scene> {
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
        result.loadFromJson(parseJsonString(await (await fileHandle.getFile()).text()));

        return result;
    }

    public async save(scene: Scene, location?: FileSystemLocationParameters): Promise<void> {
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
        await writable.write(toJsonString(scene.toJson()));
        await writable.close();
    }
}