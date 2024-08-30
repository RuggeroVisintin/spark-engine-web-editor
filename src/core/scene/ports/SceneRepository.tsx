import { SceneJsonProps } from "sparkengineweb";

export interface SceneRepository {
    read(): Promise<SceneJsonProps>;
    save(sceneJson: SceneJsonProps): Promise<void>;
}