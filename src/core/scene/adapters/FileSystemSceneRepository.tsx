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