import { Project } from "../models";
import { ProjectRepository } from "../ports";

export class OpenProjectUseCase {
    constructor(private readonly projectRepository: ProjectRepository) { }

    public async execute(): Promise<Project> {
        return this.projectRepository.read();
    }
}