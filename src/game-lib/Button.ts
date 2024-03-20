import type { CanvasPlus } from "./CanvasPlus"

export class Button {
  private hover = false
  
  public static readonly MOUSE_CLICK = 'mouse_hover'
  public static textColor = 'black'
  public static fillColor = 'white'
  public static strokeColor = 'black'
  public static hoverTextColor = 'black'
  public static hoverFillColor = 'yellow'
  public static hoverStrokeColor = 'black'
  
  private static readonly PADDING_X = 5
  private static readonly PADDING_Y = 5
  constructor (
    private x: number,
    private y: number,
    public text: string
  ) {
  }
  
  private getDimensions (canvas: CanvasPlus): {
    textX: number,
    textY: number,
    buttonX: number,
    buttonY: number,
    width: number,
    height: number
  } {
    canvas.context.textAlign = 'center'
    canvas.context.font = '16pt serif'
    const measure = canvas.context.measureText(this.text)
    const width = measure.width + 2 * Button.PADDING_X
    const height = measure.fontBoundingBoxAscent + measure.fontBoundingBoxDescent + 2 * Button.PADDING_Y
    const textX = this.x
    const textY = this.y + Button.PADDING_Y + measure.fontBoundingBoxAscent
    const buttonY = this.y
    const buttonX = this.x - measure.actualBoundingBoxRight - Button.PADDING_X
    return {
      width,
      height,
      textX,
      textY,
      buttonX,
      buttonY
    }
  }
  
  draw (canvas: CanvasPlus, held: boolean = false) {
    const hover = held || this.hover
    canvas.context.save()
    const dimensions = this.getDimensions(canvas)
    const path = new Path2D()
    path.rect(dimensions.buttonX, dimensions.buttonY, dimensions.width, dimensions.height)
    canvas.context.fillStyle = hover ? Button.hoverFillColor : Button.fillColor
    canvas.context.strokeStyle = hover ? Button.hoverFillColor : Button.fillColor
    canvas.context.fill(path)
    canvas.context.stroke(path)
    
    canvas.context.fillStyle = hover ? Button.hoverTextColor : Button.textColor
    canvas.context.fillText(this.text, dimensions.textX, dimensions.textY)
    canvas.context.restore()
  }
  
  processInput (canvas: CanvasPlus): boolean {
    canvas.context.save()
    
    const dimensions = this.getDimensions(canvas)
    const path = new Path2D()
    path.rect(dimensions.buttonX, dimensions.buttonY, dimensions.width, dimensions.height)
    this.hover = canvas.context.isPointInPath(path, canvas.mouse.x, canvas.mouse.y)
    canvas.context.restore()
    if (this.hover && canvas.mouse.pressed) {
      return true
    }
    return false
  }
}
