import { Scene } from "@sparkengine";
import { SceneRepository } from "../domain";

export class SaveSceneUseCase {
    constructor(private readonly sceneRepo: SceneRepository) { }

    public async execute(scene: Scene): Promise<void> {
        await this.sceneRepo.save(scene);
    }
}