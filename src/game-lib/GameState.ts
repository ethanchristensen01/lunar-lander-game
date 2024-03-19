export interface GameState<StateEnum> {
  initialize(): Promise<unknown>
  loadContent(): Promise<unknown>
  processInput(deltaTime: number): StateEnum
  update(deltaTime: number): void
  render(deltaTime: number): void
  unload(): void
}
