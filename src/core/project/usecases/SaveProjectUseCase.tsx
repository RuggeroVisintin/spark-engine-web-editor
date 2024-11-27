import { SceneRepository } from "../../scene";
import { Project } from "../models";
import { ProjectRepository } from "../ports";

export class SaveProjectUseCase {
    public constructor(
        private readonly projectRepository: ProjectRepository,
        private readonly sceneRepository: SceneRepository
    ) { }

    public async execute(project: Project): Promise<void> {
        await Promise.all([
            this.projectRepository.save(project),
            project.saveScenes(this.sceneRepository)
        ]);
    }
}