import { Scene } from "@sparkengine";
import { SceneRepository } from "../domain";

export class LoadSceneUseCase {
    constructor(
        private readonly sceneRepository: SceneRepository
    ) { }

    public async execute(): Promise<Scene> {
        return this.sceneRepository.read();
    }
}