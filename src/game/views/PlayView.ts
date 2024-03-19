import { GameState } from "@/game-lib/GameState"
import { StateEnum } from "./StateEnum"
import { CanvasPlus } from "@/game-lib/CanvasPlus"

export class PlayView implements GameState<StateEnum> {
  constructor (private canvas: CanvasPlus) {}
  
  initialize(): Promise<unknown> {
    throw new Error("Method not implemented.")
  }
  loadContent(): Promise<unknown> {
    throw new Error("Method not implemented.")
  }
  processInput(deltaTime: number): StateEnum {
    throw new Error("Method not implemented.")
  }
  update(deltaTime: number): void {
    throw new Error("Method not implemented.")
  }
  render(deltaTime: number): void {
    throw new Error("Method not implemented.")
  }
  unload(): void {
    throw new Error("Method not implemented.")
  }
  
}
