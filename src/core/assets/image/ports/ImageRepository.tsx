import { ImageAsset } from "sparkengineweb";
import { LocationParameters } from "../../../common";

export interface ImageRepository {
    save(image: ImageAsset, location: LocationParameters): Promise<void>;
}