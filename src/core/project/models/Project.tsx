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
        private readonly scopeRef = new WeakRef<null>(null)
    ) {
        this.name = props.name;
        this.scenePaths = props.scenes;
    }

    public async loadScenes(sceneRepository: SceneRepository): Promise<void> {
        // TODO -- add ability to load scene from directory handle in sceneRepo
        // The challenge here is how to pass the file ref to the sceneRepo without creating
        // coupling to the FileSystemSceneRepository implementation as the project
        // shouldn't assume is being loaded from the fileSystem 

        for (const scenePath of this.scenePaths) {
            const scene = await sceneRepository.read({
                accessScope: this.scopeRef,
                path: scenePath
            });

            // this.scenes.push(scene);
        }
    }
};