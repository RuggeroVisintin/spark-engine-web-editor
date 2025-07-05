import { Project } from "../Project";

export interface ProjectRepository {
    read(): Promise<Project>;
    save(project: Project): Promise<Project>;
    update(project: Project): Promise<void>;
}