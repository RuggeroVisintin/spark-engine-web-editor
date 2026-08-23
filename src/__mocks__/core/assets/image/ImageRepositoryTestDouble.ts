import { ImageAsset } from "@sparkengine";
import { ImageRepository } from "../../../../core/assets";
import { FileSystemLocationParameters, WeakRef } from "../../../../core/common";

export class ImageRepositoryTestDouble implements ImageRepository {
    public images: Map<string, ImageAsset> = new Map();

    async save(image: ImageAsset, location: FileSystemLocationParameters): Promise<void> {
        this.images.set(location.path, image);
    }

    changeScope(scopeRef: WeakRef): void {
    }
}