import { GameState } from "@/game-lib/GameState"
import { StateEnum } from "./StateEnum"
import { CanvasPlus } from "@/game-lib/CanvasPlus"
import { Button } from "@/game-lib/Button"

export class ScoresView implements GameState<StateEnum> {
  button: Button
  scores: Array<number>
  static storeKey: string = 'high-scores'
  
  constructor (private canvas: CanvasPlus) {
    this.button = new Button(50, 25, 'Back')
    this.scores = []
  }
  
  start() {
    const scores = localStorage.getItem(ScoresView.storeKey)
    if (scores) {
      this.scores = JSON.parse(scores)
    } else {
      localStorage.setItem(ScoresView.storeKey, JSON.stringify([]))
    }
    this.scores = this.scores.sort((a, b) => b - a).slice(0, 10)
  }
  
  async loadContent(): Promise<unknown> {
    this.start()
    return
  }
  
  processInput(_deltaTime: number): StateEnum {
    if (this.canvas.keyboard.isPressed('Escape')) {
      return StateEnum.Menu
    }
    const pressed = this.button.processInput(this.canvas)
    if (pressed) {
      return StateEnum.Menu
    }
    return StateEnum.Scores
  }
  update(_deltaTime: number): void {}
  render(_deltaTime: number): void {
    this.button.draw(this.canvas)
    this.canvas.context.save()
    this.canvas.context.fillStyle = 'white'
    this.canvas.context.font = '16pt sans-serif'
    this.scores.forEach((score, i) => {
      this.canvas.context.fillText(`${i + 1}:  ${score.toFixed(0)}`, 100, 40 + i * 30)
    })
    this.canvas.context.restore()
  }
  exit(): void {}
}
