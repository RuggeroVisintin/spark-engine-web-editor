import { FileSystemSceneRepository } from "./FileSystemSceneRepository";
import testSceneJson from '../../../__mocks__/assets/test-scene.json';
import { setMockedFile } from "../../../__mocks__/fs-api.mock";


describe('core/scene/adapters/FileSystemSceneRepository', () => {
    it('Should use FileSystem Web APIs to load a file at the given filePath', async () => {
        setMockedFile(JSON.stringify(testSceneJson));

        const sceneRepo = new FileSystemSceneRepository();
        expect(await sceneRepo.read()).toEqual(testSceneJson);
    });
})