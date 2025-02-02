import { Project } from "../models";

export interface ProjectRepository {
    read(): Promise<Project>;
    save(project: Project): Promise<Project>;
    update(project: Project): Promise<void>;
}