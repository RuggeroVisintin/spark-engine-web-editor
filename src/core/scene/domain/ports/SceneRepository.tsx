import { Scene } from "@sparkengine";
import { LocationParameters } from "../../../common";

export interface SceneRepository {
    read(refConfig?: LocationParameters): Promise<Scene>;
    save(sceneJson: Scene, refConfig?: LocationParameters): Promise<void>;
}