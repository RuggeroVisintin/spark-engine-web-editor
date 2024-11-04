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

    public async save(project: Project): Promise<void> {
        const directoryHandle = await window.showDirectoryPicker({
            mode: 'readwrite'
        });

        const fileHandle = await directoryHandle.getFileHandle('project-manifest.spark.json', {
            create: true
        });

        const writeSocket = await fileHandle.createWritable({
            keepExistingData: false
        });

        writeSocket.write(JSON.stringify(project.toJson()));
    }
}