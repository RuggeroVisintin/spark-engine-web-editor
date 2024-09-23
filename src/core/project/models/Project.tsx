export interface ProjectJsonProps {
    name: string;
    scenes: string[];
};

export class Project {
    public readonly name: string;
    public readonly scenes: string[];

    constructor(props: ProjectJsonProps) {
        this.name = props.name;
        this.scenes = props.scenes;
    }
};