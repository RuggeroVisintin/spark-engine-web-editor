import { FileSystemSceneRepository } from "./FileSystemSceneRepository";
import testSceneJson from '../../../__mocks__/assets/test-scene.json';
import { FileSystemWritableFileStreamMock, setMockedFile } from "../../../__mocks__/fs-api.mock";


describe('core/scene/adapters/FileSystemSceneRepository', () => {
    it('Should use FileSystem Web APIs to load a file at the given filePath', async () => {
        setMockedFile(JSON.stringify(testSceneJson));

        const sceneRepo = new FileSystemSceneRepository();
        expect(await sceneRepo.read()).toEqual(testSceneJson);
    });

    it('Should use FileSystem web APIS to save a scene file at given filePath', async () => {
        const writableSpy = jest.spyOn(FileSystemWritableFileStreamMock, 'write');

        const sceneRepo = new FileSystemSceneRepository();
        await sceneRepo.save(testSceneJson)

        expect(writableSpy).toHaveBeenCalledWith(JSON.stringify(testSceneJson))
    })
})