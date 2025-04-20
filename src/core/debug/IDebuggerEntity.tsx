import { IEntity } from "sparkengineweb";

export default interface IDebuggerEntity extends IEntity {
    match(target: IEntity): void;
}