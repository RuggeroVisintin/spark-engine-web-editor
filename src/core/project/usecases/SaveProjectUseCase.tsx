import { SceneRepository } from "../../scene";
import { Project } from "../models";
import { ProjectRepository } from "../ports";

export class SaveProjectUseCase {
    public constructor(
        private readonly projectRepository: ProjectRepository,
        private readonly sceneRepository: SceneRepository
    ) { }

    public async execute(project: Project): Promise<Project> {
        if (project.scopeRef.isEmpty()) {
            const newProject = await this.projectRepository.save(project);
            await newProject.saveScenes(this.sceneRepository);

            return newProject;
        } else {
            await Promise.all([
                this.projectRepository.update(project),
                project.saveScenes(this.sceneRepository)
            ]);

            return project;
        }
    }
}