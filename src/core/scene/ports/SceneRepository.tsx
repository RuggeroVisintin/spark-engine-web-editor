import { SceneJsonProps } from "sparkengineweb";

export interface SceneRepository {
    read(filePath: string): Promise<SceneJsonProps>;
}