import { KeyboardHandler } from "./input/KeyboardHandler"
import { MouseHandler } from "./input/MouseHandler"

/**
 * Canvas with keyboard controls and mouse movement
 */
export class CanvasPlus {
  public readonly context: CanvasRenderingContext2D
  public mouse: MouseHandler
  public keyboard: KeyboardHandler
  
  constructor (public readonly canvas: HTMLCanvasElement) {
    this.context = canvas.getContext('2d')!
    this.keyboard = new KeyboardHandler(canvas)
    this.mouse = new MouseHandler(canvas)
    canvas.focus()
  }
  
  get width (): number {
    return this.canvas.width
  }
  
  get height (): number {
    return this.canvas.height
  }
  
  public demo () {
    this.context.fillStyle = 'white'
    this.context.fillRect(0, 0, this.width, this.height)
    this.context.fillStyle = 'black'
    this.demoLoop()
  }
  
  private demoLoop () {
    if (this.mouse.pressed) {
      this.context.beginPath()
      this.context.ellipse(this.mouse.x, this.mouse.y, 10, 10, 0, 0, 2 * Math.PI)
      this.context.fill()
    }
    if (this.keyboard.isPressed('Space')) {
      this.context.fillStyle = 'white'
      this.context.fillRect(0, 0, this.width, this.height)
      this.context.fillStyle = 'black'
    }
    requestAnimationFrame(() => this.demoLoop())
  }
}
