import { SceneJsonProps } from "sparkengineweb";

export interface SceneRepository {
    read(): Promise<SceneJsonProps>;
}