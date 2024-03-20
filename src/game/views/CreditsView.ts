import { GameState } from "@/game-lib/GameState"
import { StateEnum } from "./StateEnum"
import { CanvasPlus } from "@/game-lib/CanvasPlus"
import { Button } from "@/game-lib/Button"

export class CreditsView implements GameState<StateEnum> {
  button: Button
  text: string[] = [
    'Programming: Ethan Christensen',
    'Ship Art: Ethan Christensen',
    'Background Art: Ethan Christensen',
    'Music: Ethan Christensen',
    'Sound Effects: Ethan Christensen'
  ]
  
  constructor (private canvas: CanvasPlus) {
    this.button = new Button(50, 25, 'Back')
  }
  
  start() {}
  async loadContent(): Promise<unknown> { return }
  processInput(_deltaTime: number): StateEnum {
    if (this.canvas.keyboard.isPressed('Escape')) {
      return StateEnum.Menu
    }
    const pressed = this.button.processInput(this.canvas)
    if (pressed) {
      return StateEnum.Menu
    }
    return StateEnum.Credits
  }
  update(_deltaTime: number): void {}
  render(_deltaTime: number): void {
    this.canvas.context.save()
    this.canvas.context.fillStyle = 'white'
    this.canvas.context.font = '16pt sans-serif'
    this.canvas.context.textAlign = 'center'
    this.text.forEach((tx, i) => {
      this.canvas.context.fillText(tx, this.canvas.width / 2, 200 + i * 30)
    })
    this.canvas.context.restore()
    this.button.draw(this.canvas)
  }
  exit() {}
}
