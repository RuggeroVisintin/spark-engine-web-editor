import { FileSystemSceneRepository } from "../../scene"
import { Project } from "./Project"

describe('core/project/models/Project', () => {
    const sceneRepo = new FileSystemSceneRepository();

    describe('.constructor()', () => {
        it('should create a new instance of Project with the given props', () => {
            expect(new Project({
                name: 'test-project',
                scenes: ['scenes/test.scene.spark.json']
            })).toEqual({
                name: 'test-project',
                scenePaths: ['scenes/test.scene.spark.json'],
                scenes: []
            })
        })
    })

    describe('.loadScenes()', () => {
        it('Should load the scene files based on the given paths', async () => {
            const project = new Project({
                name: 'test-project',
                scenes: ['scenes/test.scene.spark.json']
            });

            await project.loadScenes(sceneRepo);

            expect(project.scenes).toEqual([
                expect.objectContaining({ name: 'test-scene' })
            ])
        })
    })
})