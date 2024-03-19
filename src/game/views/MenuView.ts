import { GameState } from "@/game-lib/GameState"
import { StateEnum } from "./StateEnum"
import { CanvasPlus } from "@/game-lib/CanvasPlus"

export class MenuView implements GameState<StateEnum> {
  buttons = {}
  
  constructor (private canvas: CanvasPlus) {}
  
  initialize(): Promise<unknown> {
    throw new Error("Method not implemented.")
  }
  loadContent(): Promise<unknown> {
    throw new Error("Method not implemented.")
  }
  processInput(deltaTime: number): StateEnum {
    throw new Error("Method not implemented.")
    this.canvas.mouse.pressed
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
