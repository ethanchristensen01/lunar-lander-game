export interface GameState<StateEnum> {
  start(): void
  loadContent(): Promise<unknown>
  processInput(deltaTime: number): StateEnum
  update(deltaTime: number): void
  render(deltaTime: number): void
  exit(): void
}
