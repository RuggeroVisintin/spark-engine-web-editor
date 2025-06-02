
import { IEntity, RenderSystem } from "sparkengineweb";
import { MouseClickEvent } from "../../components";
import { ObjectPicker } from "./ports/ObjectPicker";
import { Optional } from "../common";

export class ObjectPickingService {
    private _selectedEntity?: IEntity;

    public get selectedEntity(): Optional<IEntity> {
        return this._selectedEntity;
    }

    constructor(private readonly objectPicker: ObjectPicker) {
    }

    handleMouseClick(event: MouseClickEvent): void {
        if (event.button !== 0) return;

        this._selectedEntity = this.objectPicker.pick(event.targetX, event.targetY);
    }

    getRenderSystem(): RenderSystem {
        return this.objectPicker;
    }
}