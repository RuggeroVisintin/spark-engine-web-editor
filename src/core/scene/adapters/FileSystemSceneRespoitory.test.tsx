import { FileSystemSceneRepository } from "./FileSystemSceneRepository";
import testSceneJson from '../../../__mocks__/assets/test-scene.json';
import { FileSystemWritableFileStreamMock, setMockedFile } from "../../../__mocks__/fs-api.mock";
import { GameEngine } from "sparkengineweb";

const gameEngine = new GameEngine({
    framerate: 60,
    context: new CanvasRenderingContext2D(),
    resolution: {
        width: 800,
        height: 600
    }
})


describe('core/scene/adapters/FileSystemSceneRepository', () => {
    it('Should use FileSystem Web APIs to load a file at the given filePath', async () => {
        setMockedFile(JSON.stringify(testSceneJson));

        const sceneRepo = new FileSystemSceneRepository(gameEngine);
        expect((await sceneRepo.read()).toJson()).toEqual(testSceneJson);
    });

    it('Should use FileSystem web APIS to save a scene file at given filePath', async () => {
        const writableSpy = jest.spyOn(FileSystemWritableFileStreamMock, 'write');

        const sceneRepo = new FileSystemSceneRepository(gameEngine);
        const testScene = gameEngine.createScene();
        testScene.loadFromJson(testSceneJson);

        await sceneRepo.save(testScene);

        expect(writableSpy).toHaveBeenCalledWith(JSON.stringify(testSceneJson))
    })
})