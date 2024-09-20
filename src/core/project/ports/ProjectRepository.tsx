import { Project } from "../models";

export interface ProjectRepository {
    read(): Promise<Project>;
    save(sceneJson: Project): Promise<void>;
}