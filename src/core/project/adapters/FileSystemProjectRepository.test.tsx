import { createDirectoryHandleMock, FileSystemWritableFileStreamMock, setMockedFile } from "../../../__mocks__/fs-api.mock";
import testProjectJson from "../../../__mocks__/assets/test-project.json";
import { FileSystemProjectRepository } from "./FileSystemProjectRepository";
import { Project } from "../models";
import { WeakRef } from "../../../common";

describe('core/project/adapters/FileSystemProjectRepository', () => {
    describe('read', () => {
        it('Should use FileSystem Web APIs to load a file at the given filePath', async () => {
            setMockedFile(JSON.stringify(testProjectJson));

            const expectedProject = new Project(testProjectJson, new WeakRef(createDirectoryHandleMock()));

            const projectRepo = new FileSystemProjectRepository();
            expect(JSON.stringify(await projectRepo.read())).toEqual(JSON.stringify(expectedProject));
        })
    });

    describe('save', () => {
        it('Should use FileSystem Web APIs to save a project file to the given filePath', async () => {
            const directoryHandleRef = createDirectoryHandleMock();
            const projectToSave = new Project(testProjectJson, new WeakRef(directoryHandleRef));

            const projectRepo = new FileSystemProjectRepository();
            await projectRepo.save(projectToSave);

            expect(FileSystemWritableFileStreamMock.write).toHaveBeenCalled();
        })
    })

})