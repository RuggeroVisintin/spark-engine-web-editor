import { Project } from "../models";
import { ProjectRepository } from "../ports";

export class FileSystemProjectRepository implements ProjectRepository {
    public async read(): Promise<Project> {
        const [fileHandle] = await window.showOpenFilePicker({
            multiple: false,
            types: [{
                accept: {
                    'application/json': ['.proj.spark.json']
                }
            }]
        });

        return JSON.parse(await (await fileHandle.getFile()).text());
    }

    public async save(): Promise<void> {
        throw new Error("Method not implemented.");
    }
}