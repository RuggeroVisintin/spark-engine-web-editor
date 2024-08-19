import { GameEngine, Scene } from "sparkengineweb";
import { SceneRepository } from "../ports";

export class LoadSceneUseCase {
    constructor(
        private readonly engine: GameEngine,
        private readonly sceneRepository: SceneRepository
    ) { }

    public async execute(filePath: string): Promise<Scene> {
        const newScene = this.engine.createScene();

        newScene.loadFromJson(await this.sceneRepository.read(filePath));

        return newScene;
    }
}