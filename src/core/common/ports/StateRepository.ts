export interface StateRepository<T> {
  subscribe(callback: (state: T) => void): () => void;
  update(state: T): void;
  get(): T;
}