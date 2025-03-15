import { Scene } from "@sparkengine";
import { RefConfigParams } from "../../common";

export interface SceneRepository {
    read(refConfig?: RefConfigParams): Promise<Scene>;
    save(sceneJson: Scene, refConfig?: RefConfigParams): Promise<void>;
}