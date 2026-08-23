import { WeakRef } from "..";

export interface FileSystemLocationParameters extends LocationParameters {
    accessScope: WeakRef<FileSystemDirectoryHandle>;
    path: string;
}

export interface LocationParameters {
    accessScope: WeakRef;
    path: string;
}

export abstract class FileSystemRepository {
    protected async getTargetFileHandle(location: FileSystemLocationParameters, shouldCreate = false): Promise<FileSystemFileHandle> {
        let currentScope = location.accessScope.get() as FileSystemDirectoryHandle;

        const directories = location.path.split('/');
        const filename = directories.pop();

        for (let i = 0; i < directories.length; i++) {
            currentScope = await currentScope.getDirectoryHandle(directories[i], { create: shouldCreate });
        }

        return await currentScope.getFileHandle(filename ?? '', {
            create: shouldCreate
        });
    }
}