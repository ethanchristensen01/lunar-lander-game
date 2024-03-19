import type { CanvasPlus } from "./CanvasPlus"

export class Button {
  private hover = false
  
  public static readonly MOUSE_CLICK = 'mouse_hover'
  public static textColor = ''
  public static fillColor = ''
  public static strokeColor = ''
  public static hoverColor = ''
  public static hoverTextColor = ''
  public static hoverStrokeColor = ''
  
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
    const measure = canvas.context.measureText(this.text)
    const width = measure.width + 2 * Button.PADDING_X
    const height = measure.fontBoundingBoxAscent + measure.fontBoundingBoxDescent + 2 * Button.PADDING_Y
    const textX = this.x - measure.actualBoundingBoxLeft
    const textY = this.y + Button.PADDING_Y + measure.actualBoundingBoxDescent
    const buttonY = this.y
    const buttonX = this.x - measure.actualBoundingBoxLeft - Button.PADDING_X
    return {
      width,
      height,
      textX,
      textY,
      buttonX,
      buttonY
    }
  }
  
  draw (canvas: CanvasPlus) {
    const dimensions = this.getDimensions(canvas)
    const path = new Path2D()
    path.rect(dimensions.buttonX, dimensions.buttonY, dimensions.width, dimensions.height)
    canvas.context.fill(path)
    canvas.context.stroke(path)
    canvas.context.fillText(this.text, dimensions.textX, dimensions.textY)
  }
  
  processInput (canvas: CanvasPlus): boolean {
    const dimensions = this.getDimensions(canvas)
    const path = new Path2D()
    path.rect(dimensions.buttonX, dimensions.buttonY, dimensions.width, dimensions.height)
    this.hover = canvas.context.isPointInStroke(path, canvas.mouse.x, canvas.mouse.y)
    if (this.hover && canvas.mouse.pressed) {
      return true
    }
    return false
  }
}
