import { SceneJsonProps } from "sparkengineweb";
import { WeakRef } from "../../../common";

interface RefConfigParams {
    accessScope: WeakRef;
    path: string;
}

export interface SceneRepository {
    read(refConfig?: RefConfigParams): Promise<SceneJsonProps>;
    save(sceneJson: SceneJsonProps): Promise<void>;
}