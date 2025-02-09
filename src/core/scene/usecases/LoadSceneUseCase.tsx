import { Scene } from "@sparkengine";
import { SceneRepository } from "../ports";

export class LoadSceneUseCase {
    constructor(
        private readonly sceneRepository: SceneRepository
    ) { }

    public async execute(): Promise<Scene> {
        return this.sceneRepository.read();
    }
}