import { SceneJsonProps } from "sparkengineweb";
import { SceneRepository } from "../ports";

export class FileSystemSceneRepository implements SceneRepository {
    public async read(): Promise<SceneJsonProps> {
        const [fileHandle] = await window.showOpenFilePicker({
            multiple: false,
            types: [{
                accept: {
                    'application/json': ['.spark.json']
                }
            }]
        });

        return JSON.parse(await (await fileHandle.getFile()).text());
    }
}