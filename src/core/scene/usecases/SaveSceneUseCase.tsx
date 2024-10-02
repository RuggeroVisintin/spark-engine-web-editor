import { Scene } from "sparkengineweb";
import { SceneRepository } from "../ports";

export class SaveSceneUseCase {
    constructor(private readonly sceneRepo: SceneRepository) { }

    public async execute(scene: Scene): Promise<void> {
        await this.sceneRepo.save(scene);
    }
}