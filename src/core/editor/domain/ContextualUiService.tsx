import { IEntity, Rgb, Scene, Vec2 } from "sparkengineweb";
import { EntityOutline } from "./entities";
import Pivot from "./entities/Pivot";

export class ContextualUiService {
    private _spawnPivot = new Pivot({ diffuseColor: new Rgb(255, 125, 0) });
    private _currentEntityOriginPivot = new Pivot({ size: { width: 0, height: 0 }, diffuseColor: new Rgb(255, 255, 0) });
    private _currentEntityOutline = new EntityOutline();

    public get spawnPivot(): Pivot {
        return this._spawnPivot;
    }

    public get currentEntityOriginPivot(): Pivot {
        return this._currentEntityOriginPivot;
    }

    public get currentEntityOutline(): EntityOutline {
        return this._currentEntityOutline;
    }

    public start(contextualUiScene: Scene): void {
        contextualUiScene.registerEntity(this._currentEntityOutline);
        contextualUiScene.registerEntity(this._spawnPivot);
        contextualUiScene.registerEntity(this._currentEntityOriginPivot);
    }

    public moveSpawnOrigin(position: Vec2): void {
        this._spawnPivot.position = position;
    }

    public focusOnEntity(entity: IEntity): void {
        this._currentEntityOriginPivot.match(entity);
        this._currentEntityOutline.match(entity);

        this._currentEntityOriginPivot.transform.size = { width: 10, height: 10 };
    }

    public loseFocus(): void {
        this.currentEntityOriginPivot.transform.size = { width: 0, height: 0 };
        this.currentEntityOutline.transform.size = { width: 0, height: 0 };
    }
}