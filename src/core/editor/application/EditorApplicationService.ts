import { IEntity, Vec2, Rgb, ImageAsset, MaterialComponent } from '@sparkengine';
import { MouseClickEvent, MouseDragEvent } from '../../common/events/mouse';

export interface EditorApplicationService {
  // Entity operations
  addEntity(entity: IEntity): void;
  selectEntity(entity: IEntity): void;
  removeEntity(uuid: string): void;
  
  // Entity updates
  updateCurrentEntityPosition(newPosition: Vec2): void;
  updateCurrentEntitySize(newSize: { width: number, height: number }): void;
  updateCurrentEntityMaterial(params: { 
    newDiffuseColor?: Rgb, 
    newOpacity?: number, 
    newDiffuseTexture?: ImageAsset, 
    removeDiffuseColor?: boolean 
  }): void;
  
  // Project operations
  openProject(): Promise<void>;
  saveProject(): Promise<void>;
  
  // Engine operations
  handleMouseClick(e: MouseClickEvent): void;
  handleMouseDrag(e: MouseDragEvent): void;
  
  // Engine initialization
  start(context: CanvasRenderingContext2D, resolution: { width: number, height: number }): void;
}