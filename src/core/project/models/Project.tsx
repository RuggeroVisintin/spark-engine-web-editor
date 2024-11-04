import { Scene } from "sparkengineweb";
import { SceneRepository } from "../../scene";
import { WeakRef } from "../../../common";

export interface ProjectJsonProps {
    name: string;
    scenes: string[];
};

export class Project {
    public readonly name: string;
    public readonly scenePaths: string[];
    public scenes: Scene[] = [];

    constructor(
        props: ProjectJsonProps,
        private readonly scopeRef: WeakRef = new WeakRef<null>(null)
    ) {
        this.name = props.name;
        this.scenePaths = props.scenes;
    }

    public async loadScenes(sceneRepository: SceneRepository): Promise<void> {
        for (const scenePath of this.scenePaths) {
            const scene = await sceneRepository.read({
                accessScope: this.scopeRef,
                path: scenePath
            });

            this.scenes.push(scene);
        }
    }

    public toJson(): ProjectJsonProps {
        return {
            name: this.name,
            scenes: this.scenePaths,

        }
    }
};