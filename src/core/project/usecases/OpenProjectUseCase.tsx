import { SceneRepository } from "../../scene";
import { Project } from "../models";
import { ProjectRepository } from "../ports";

export class OpenProjectUseCase {
    constructor(
        private readonly projectRepository: ProjectRepository,
        private readonly sceneRepository: SceneRepository,
    ) { }

    public async execute(): Promise<Project> {
        const result = await this.projectRepository.read();

        // TODO -- load scenes data

        return result;
    }
}