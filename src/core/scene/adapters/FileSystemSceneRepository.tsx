import { SceneJsonProps } from "sparkengineweb";
import { SceneRepository } from "../ports";

export class FileSystemSceneRepository implements SceneRepository {
    public async read(filePath: string): Promise<SceneJsonProps> {
        return Promise.resolve({
            entities: {}
        })
    }
}