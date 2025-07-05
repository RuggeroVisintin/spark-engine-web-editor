import { IEntity, Scene } from "sparkengineweb";

export interface EditorState {
  currentEntity?: IEntity;
  entities?: IEntity[];
  currentScene?: Scene;
}

export interface StateRepository {
  subscribe(callback: (state: EditorState) => void): () => void;
  update(state: EditorState): void;
}