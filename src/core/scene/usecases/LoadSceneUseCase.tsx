import { Scene } from "sparkengineweb";
import { SceneRepository } from "../ports";

export class LoadSceneUseCase {
    constructor(
        private readonly sceneRepository: SceneRepository
    ) { }

    public async execute(scene: Scene): Promise<void> {
        scene.loadFromJson(await this.sceneRepository.read());
    }
}