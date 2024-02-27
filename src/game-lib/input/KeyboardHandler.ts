export class KeyboardHandler {
  public keysPressed: Set<string>
  
  constructor (element: HTMLElement) {
    this.keysPressed = new Set()
    this.addHandlers(element)
  }
  
  public isPressed (code: string) {
    return this.keysPressed.has(code)
  }
  
  private keyDownHandler (event: KeyboardEvent) {
    this.keysPressed.add(event.code)
  }
  
  private keyUpHandler (event: KeyboardEvent) {
    this.keysPressed.delete(event.code)
  }
  
  private addHandlers (element: HTMLElement) {
    element.addEventListener('keydown', event => console.log(event))
    element.addEventListener('keydown', event => this.keyDownHandler(event))
    element.addEventListener('keyup', event => this.keyUpHandler(event))
  }
}
