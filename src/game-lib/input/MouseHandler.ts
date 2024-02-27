export class MouseHandler {
  public x: number = 0
  public y: number = 0
  public pressed: boolean = false
  
  constructor (element: HTMLCanvasElement) {
    this.addHandlers(element)
  }
  
  private mouseMoveHandler (event: MouseEvent, element: HTMLCanvasElement) {
    const rect = element.getBoundingClientRect()
    const scaleX = element.width / rect.width
    const scaleY = element.height / rect.height
    this.x = (event.clientX - rect.left) * scaleX
    this.y = (event.clientY - rect.top) * scaleY
  }
  
  private mouseDownHandler (event: MouseEvent, element: HTMLCanvasElement) {
    this.pressed = true
    element.focus()
    event.preventDefault()
  }
  
  private mouseUpHandler (_event: MouseEvent) {
    this.pressed = false
  }
  
  private addHandlers (element: HTMLCanvasElement) {
    element.addEventListener('mousemove', event => this.mouseMoveHandler(event, element))
    element.addEventListener('mousedown', event => this.mouseDownHandler(event, element))
    element.addEventListener('mouseup', event => this.mouseUpHandler(event))
    element.addEventListener('mouseout', event => this.mouseUpHandler(event))
  }
}
