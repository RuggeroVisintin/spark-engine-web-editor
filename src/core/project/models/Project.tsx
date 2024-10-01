import { Scene } from "sparkengineweb";

export interface ProjectJsonProps {
    name: string;
    scenes: string[];
};

export class Project {
    public readonly name: string;
    public readonly scenePaths: string[];
    public scenes: Scene[] = [];

    constructor(props: ProjectJsonProps) {
        this.name = props.name;
        this.scenePaths = props.scenes;
    }
};