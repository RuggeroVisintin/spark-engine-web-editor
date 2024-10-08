import { createDirectoryHandleMock, setMockedFile } from "../../../__mocks__/fs-api.mock";
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

})