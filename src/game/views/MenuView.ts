import { GameState } from "@/game-lib/GameState"
import { StateEnum } from "./StateEnum"
import { CanvasPlus } from "@/game-lib/CanvasPlus"
import { Button } from "@/game-lib/Button"

export class MenuView implements GameState<StateEnum> {
  buttons: Array<{button: Button, newState: StateEnum}>
  
  constructor (private canvas: CanvasPlus) {
    this.buttons = [
      {
        button: new Button(this.canvas.width / 2, 60, 'Play Game'),
        newState: StateEnum.Play
      },
      {
        button: new Button(this.canvas.width / 2, 110, 'Controls'),
        newState: StateEnum.Controls
      },
      {
        button: new Button(this.canvas.width / 2, 160, 'High Scores'),
        newState: StateEnum.Scores
      },
      {
        button: new Button(this.canvas.width / 2, 210, 'Credits'),
        newState: StateEnum.Credits
      }
    ]
  }
  
  start() {}
  async loadContent(): Promise<unknown> { return }
  processInput(_deltaTime: number): StateEnum {
    const pressed = this.buttons.filter(b => b.button.processInput(this.canvas))
    if (pressed[0]) {
      return pressed[0].newState
    }
    return StateEnum.Menu
  }
  update(_deltaTime: number): void {}
  render(_deltaTime: number): void {
    this.buttons.forEach(b => b.button.draw(this.canvas))
  }
  exit() {}
}
