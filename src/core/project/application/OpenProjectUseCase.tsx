import { SceneRepository } from "../../scene";
import { Project } from "../domain";
import { ProjectRepository } from "../ports";

export class OpenProjectUseCase {
    constructor(
        private readonly projectRepository: ProjectRepository,
        private readonly sceneRepository: SceneRepository,
    ) { }

    public async execute(): Promise<Project> {
        const lodedProject = await this.projectRepository.read();

        await lodedProject.loadScenes(this.sceneRepository);

        return lodedProject;
    }
}