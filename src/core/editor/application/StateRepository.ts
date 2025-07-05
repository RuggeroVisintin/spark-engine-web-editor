import { IEntity, Scene, Vec2 } from "sparkengineweb";

export interface EditorState {
  currentEntity?: IEntity;
  entities?: IEntity[];
  currentScene?: Scene;
  spawnPoint?: Vec2
}

export interface StateRepository {
  subscribe(callback: (state: EditorState) => void): () => void;
  update(state: EditorState): void;
}