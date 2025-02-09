import { FileSystemSceneRepository } from "./FileSystemSceneRepository";
import testSceneJson from '../../../__mocks__/assets/test-scene.json';
import { createDirectoryHandleMock, FileSystemWritableFileStreamMock, setMockedFile } from "../../../__mocks__/fs-api.mock";
import { GameEngine } from "@sparkengine";
import { WeakRef } from "../../../common";

const gameEngine = new GameEngine({
    framerate: 60,
    context: new CanvasRenderingContext2D(),
    resolution: {
        width: 800,
        height: 600
    }
})


describe('core/scene/adapters/FileSystemSceneRepository', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('.read()', () => {
        it('Should use FileSystem Web APIs to prompt the user to pick a scene file', async () => {
            setMockedFile(JSON.stringify(testSceneJson));

            const sceneRepo = new FileSystemSceneRepository(gameEngine);
            expect((await sceneRepo.read()).toJson()).toEqual(testSceneJson);
        });

        it('Should use FileSystem web APIs to read a file from the given folder scope withouth prompting the user when valid scopeRef is provided', async () => {
            setMockedFile(JSON.stringify(testSceneJson));

            const sceneRepo = new FileSystemSceneRepository(gameEngine);
            const result = await sceneRepo.read({
                accessScope: new WeakRef<FileSystemDirectoryHandle>(createDirectoryHandleMock() as unknown as FileSystemDirectoryHandle),
                path: 'test-scene.json'
            })

            expect(global.showOpenFilePicker).not.toHaveBeenCalled();
            expect(result.toJson()).toEqual(testSceneJson);
        });
    });

    describe('.save()', () => {
        it('Should use FileSystem web APIs to save a scene file at given filePath', async () => {
            const writableSpy = jest.spyOn(FileSystemWritableFileStreamMock, 'write');

            const sceneRepo = new FileSystemSceneRepository(gameEngine);
            const testScene = gameEngine.createScene();
            testScene.loadFromJson(testSceneJson);

            await sceneRepo.save(testScene);

            expect(writableSpy).toHaveBeenCalledWith(JSON.stringify(testSceneJson))
        });

        it('Shouls use FileSystem web APIs to save a scene file at the specified location when provided', async () => {
            const writableSpy = jest.spyOn(FileSystemWritableFileStreamMock, 'write');

            const testScene = gameEngine.createScene();
            testScene.loadFromJson(testSceneJson);

            const sceneRepo = new FileSystemSceneRepository(gameEngine);
            await sceneRepo.save(testScene, {
                accessScope: new WeakRef<FileSystemDirectoryHandle>(createDirectoryHandleMock() as unknown as FileSystemDirectoryHandle),
                path: 'test-scene.json'
            })

            expect(global.showSaveFilePicker).not.toHaveBeenCalled();
            expect(writableSpy).toHaveBeenCalledWith(JSON.stringify(testSceneJson));
        })
    })





})