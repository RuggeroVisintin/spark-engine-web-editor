import { Scene } from "sparkengineweb";
import { WeakRef } from "../../../common";

interface RefConfigParams {
    accessScope: WeakRef;
    path: string;
}
export interface SceneRepository {
    read(refConfig?: RefConfigParams): Promise<Scene>;
    save(sceneJson: Scene): Promise<void>;
}