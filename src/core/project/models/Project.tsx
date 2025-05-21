import { Scene } from "@sparkengine";
import { SceneRepository } from "../../scene";
import { WeakRef } from "../../../common";

export interface ProjectJsonProps {
    name: string;
    scenes: string[];
}

export class Project {
    public readonly name: string;
    public readonly scenePaths: string[];
    public scenes: Scene[] = [];

    constructor(
        props: ProjectJsonProps,
        public readonly scopeRef: WeakRef = new WeakRef<null>(null)
    ) {
        this.name = props.name;
        this.scenePaths = props.scenes;
    }

    static fromProject(project: Project, scopeRef?: WeakRef): Project {
        const result = new Project(project.toJson(), scopeRef);

        result.scenes = project.scenes;

        return result;
    }

    // TODO - move this coordination effort at the useCase level and use a Project.addScenes method instead
    public async loadScenes(sceneRepository: SceneRepository): Promise<void> {
        for (const scenePath of this.scenePaths) {
            const scene = await sceneRepository.read({
                accessScope: this.scopeRef,
                path: scenePath
            });

            this.scenes.push(scene);
        }
    }

    public async saveScenes(sceneRepository: SceneRepository): Promise<void> {
        await Promise.all(this.scenes.map((scene, index) => {
            return sceneRepository.save(scene, {
                path: this.scenePaths[index],
                accessScope: this.scopeRef as WeakRef<FileSystemDirectoryHandle>,
            })
        }));
    }

    public addScene(scene: Scene): void {
        this.scenes.push(scene);
        this.scenePaths.push(`scenes/test-scene.spark.json`)
    }

    public toJson(): ProjectJsonProps {
        return {
            name: this.name,
            scenes: this.scenePaths
        }
    }
}