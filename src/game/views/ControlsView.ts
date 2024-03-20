import { GameState } from "@/game-lib/GameState"
import { StateEnum } from "./StateEnum"
import { CanvasPlus } from "@/game-lib/CanvasPlus"
import { Button } from "@/game-lib/Button"
import { KeyId, KeyInfo, inputKeys } from "../controls"

interface ButtonInfo {
  button: Button,
  keyInfo: KeyInfo,
  y: number
}


export class ControlsView implements GameState<StateEnum> {
  exitButton: Button
  buttons: Array<ButtonInfo> = []
  
  reading: undefined | KeyId
  constructor (private canvas: CanvasPlus) {
    const x = 160
    const ystart = 20
    const ydiff = 50
    this.buttons = Object.values(inputKeys).map((keyInfo, i) => {
      const y = ystart + ydiff * i
      return {
        keyInfo,
        button: new Button(x, y, keyInfo.name),
        y
      }
    })
    this.exitButton = new Button(50, 25, 'Back')
  }
  
  start() {
    Object.values(inputKeys).forEach(keyInfo => {
      const newKey = localStorage.getItem(keyInfo.id)
      if (newKey) {
        keyInfo.key = newKey
      } else {
        localStorage.setItem(keyInfo.id, keyInfo.key)
      }
    })
    this.canvas.mouse.pressed = false
    this.reading = undefined
  }
  async loadContent(): Promise<unknown> {
    this.start()
    return
  }
  processInput(_deltaTime: number): StateEnum {
    if (this.canvas.keyboard.isPressed('Escape')) {
      return StateEnum.Menu
    }
    if (this.exitButton.processInput(this.canvas)) {
      return StateEnum.Menu
    }
    if (this.reading && this.canvas.keyboard.keysPressed.size > 0) {
      const info = inputKeys[this.reading]
      if (info){
        const key = [...this.canvas.keyboard.keysPressed.keys()][0]
        info.key = key
        localStorage.setItem(info.id, key)
      }
      this.reading = undefined
    }
    const pressed = this.buttons.filter(b => b.button.processInput(this.canvas))[0]
    if (pressed) {
      this.reading = pressed.keyInfo.id
    }
    return StateEnum.Controls
  }
  update(_deltaTime: number): void {}
  render(_deltaTime: number): void {
    this.canvas.context.save()
    this.canvas.context.fillStyle = 'white'
    this.canvas.context.font = '16pt sans-serif'
    this.buttons.forEach(b => {
      b.button.draw(this.canvas, this.reading === b.keyInfo.id)
      this.canvas.context.fillText(this.reading === b.keyInfo.id ? '???' : b.keyInfo.key, 258, b.y + 24)
    })
    this.canvas.context.restore()
    this.exitButton.draw(this.canvas)
  }
  exit() {}
}
