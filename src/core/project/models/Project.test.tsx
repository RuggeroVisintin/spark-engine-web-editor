import { Project } from "./Project"

describe('core/project/models/Project', () => {
    describe('.constructor()', () => {
        it('should create a new instance of Project with the given props', () => {
            expect(new Project({
                name: 'test-project',
                scenes: ['scenes/test.scene.spark.json']
            })).toEqual({
                name: 'test-project',
                scenes: ['scenes/test.scene.spark.json']
            })
        })
    })
})