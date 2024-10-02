import { Scene } from "sparkengineweb";
import { SceneRepository } from "../ports";

export class LoadSceneUseCase {
    constructor(
        private readonly sceneRepository: SceneRepository
    ) { }

    public async execute(): Promise<Scene> {
        return this.sceneRepository.read();
    }
}