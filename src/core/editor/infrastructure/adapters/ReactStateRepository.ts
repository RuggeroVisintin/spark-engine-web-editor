import { EditorState, StateRepository } from '../../application/StateRepository';

export class ReactStateRepository implements StateRepository {
  private subscribers = new Set<(currentState: EditorState) => void>();
  private currentState: EditorState = {};

  constructor(initialState: EditorState = {}) {
    this.currentState = { ...this.currentState, ...initialState };
  }

  subscribe(callback: (state: EditorState) => void): () => void {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  update(state: EditorState): void {
    this.currentState = { ...this.currentState, ...state };
    this.subscribers.forEach(callback => callback(this.currentState));
  }
}