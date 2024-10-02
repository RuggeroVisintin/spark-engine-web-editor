import { Scene } from "sparkengineweb";

export interface SceneRepository {
    read(): Promise<Scene>;
    save(sceneJson: Scene): Promise<void>;
}