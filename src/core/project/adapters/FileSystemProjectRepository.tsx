import { WeakRef } from "../../../common";
import { Project } from "../models";
import { ProjectRepository } from "../ports";

export class FileSystemProjectRepository implements ProjectRepository {
    public async read(): Promise<Project> {
        const directoryHandle = await window.showDirectoryPicker({
            mode: 'readwrite'
        })

        const fileHandle = await directoryHandle.getFileHandle('project-manifest.spark.json', {
            create: false
        });

        return new Project(JSON.parse(await (await fileHandle.getFile()).text()), new WeakRef(directoryHandle));
    }

    public async save(project: Project): Promise<Project> {
        const result = Project.fromProject(project, new WeakRef(await window.showDirectoryPicker({
            mode: 'readwrite'
        })));

        await this.__persistProject(result);

        await (result.scopeRef.get() as FileSystemDirectoryHandle).getDirectoryHandle('scenes', {
            create: true
        });

        return result;
    }

    public async update(project: Project): Promise<void> {
        if (!project.scopeRef || project.scopeRef.isEmpty()) {
            throw new Error('Project does not have a scope reference');
        }

        await this.__persistProject(project);
    }

    private async __persistProject(project: Project): Promise<void> {
        const directoryHandle = project.scopeRef.get() as FileSystemDirectoryHandle;

        const fileHandle = await directoryHandle.getFileHandle('project-manifest.spark.json', {
            create: true
        });

        const writeSocket = await fileHandle.createWritable({
            keepExistingData: false
        });

        await writeSocket.write(JSON.stringify(project.toJson()));
        await writeSocket.close();
    }
}