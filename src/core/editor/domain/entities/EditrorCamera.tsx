import { BaseEntity, CameraComponent, Type } from "sparkengineweb";

@Type('EditorCamera')
export class EditorCamera extends BaseEntity {
    constructor() {
        super();

        this.addComponent(new CameraComponent());
    }
}