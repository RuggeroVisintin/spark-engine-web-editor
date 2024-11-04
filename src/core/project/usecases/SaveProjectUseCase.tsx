import { Project } from "../models";
import { ProjectRepository } from "../ports";

export class SaveProjectUseCase {
    public constructor(private readonly projectRepository: ProjectRepository) { }

    public async execute(project: Project): Promise<void> {
        this.projectRepository.save(project);
    }
}