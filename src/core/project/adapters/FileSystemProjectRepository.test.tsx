import { setMockedFile } from "../../../__mocks__/fs-api.mock";
import testProjectJson from "../../../__mocks__/assets/test-project.json";
import { FileSystemProjectRepository } from "./FileSystemProjectRepository";

describe('core/project/adapters/FileSystemProjectRepository', () => {
    describe('read', () => {
        it('Should use FileSystem Web APIs to load a file at the given filePath', async () => {
            setMockedFile(JSON.stringify(testProjectJson));

            const projectRepo = new FileSystemProjectRepository();
            expect(await projectRepo.read()).toEqual(testProjectJson);
        })
    });

})