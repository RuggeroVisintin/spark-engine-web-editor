import { BaseEntity, CameraComponent, typeOf } from 'sparkengineweb';
import { EditorCamera } from './EditrorCamera';

describe('core/debug/EditorCamera', () => {
    it('Should be an instance of BaseEntity', () => {
        const camera = new EditorCamera();
        expect(camera).toBeInstanceOf(BaseEntity);
    });

    it('Should have a camera component registered by default', () => {
        const camera = new EditorCamera();

        expect(camera.getComponent('CameraComponent')).toBeDefined();
    });

    it('Should have the correct type', () => {
        const camera = new EditorCamera();
        expect(typeOf(camera)).toBe('EditorCamera');
    });
});