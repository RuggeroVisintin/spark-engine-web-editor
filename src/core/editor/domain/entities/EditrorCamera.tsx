import { BaseEntity, CameraComponent, GameObject, Type } from "sparkengineweb";

@Type('EditorCamera')
export class EditorCamera extends BaseEntity {
    constructor() {
        super();

        const cameraComponent = new CameraComponent({
            transform: {
                size: { width: 1920, height: 1080 }
            }
        })

        this.addComponent(cameraComponent);
        this.addComponent(cameraComponent.transform)
    }
}