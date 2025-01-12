import { SceneRepository } from "../../scene";
import { Project } from "../models";
import { ProjectRepository } from "../ports";

export class SaveProjectUseCase {
    public constructor(
        private readonly projectRepository: ProjectRepository,
        private readonly sceneRepository: SceneRepository
    ) { }

    public async execute(project: Project): Promise<void> {
        if (project.scopeRef.isEmpty()) {
            // TODO -- when project was not loaeded from folder yet, we need to save it before saving the scenes

        } else {
            await Promise.all([
                this.projectRepository.save(project),
                project.saveScenes(this.sceneRepository)
            ]);
        }
    }
}