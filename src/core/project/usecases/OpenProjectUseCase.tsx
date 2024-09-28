import { Project } from "../models";
import { ProjectRepository } from "../ports";

export class OpenProjectUseCase {
    constructor(private readonly projectRepository: ProjectRepository) { }

    public async execute(): Promise<Project> {
        return await this.projectRepository.read();
    }
}