export interface ProjectJsonProps {
    name: string;
    scenes: string[];
}

export interface ProjectRepository {
    read(): Promise<ProjectJsonProps>;
    save(sceneJson: ProjectJsonProps): Promise<void>;
}