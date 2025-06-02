import { IEntity } from "sparkengineweb";
import { Optional } from "../../common";

export interface ObjectPicker {
    pick(x: number, y: number): Optional<IEntity>;
}