import { CameraComponent, GameObject, Type } from "sparkengineweb";

@Type('EditorCamera')
export class EditorCamera extends GameObject {
    constructor() {
        super();

        this.addComponent(new CameraComponent());
        this.transform.size = { width: 1920, height: 1080 };
    }
}