import { GameState } from "@/game-lib/GameState"
import { StateEnum } from "./StateEnum"
import { CanvasPlus } from "@/game-lib/CanvasPlus"
import { ReadyLine, generateTerrain } from "@/algorithms/midpointDisplacement"
import { loadAudio, loadImage } from "@/game-lib/loadAsset"
import { Ship } from "../models/Ship"
import { lineCircleIntersection } from "@/algorithms/intersection"
export class PlayView implements GameState<StateEnum> {
  private paused = false
  private temp = false
  private line?: ReadyLine
  private shipImage?: HTMLImageElement
  private song?: HTMLAudioElement
  private thruster?: HTMLAudioElement
  private success?: HTMLAudioElement
  private explode?: HTMLAudioElement
  
  private won = false
  private level = 1
  
  private shipModel?: Ship
  
  constructor (private canvas: CanvasPlus) {}
  
  start() {
    this.paused = false
    this.line = generateTerrain(2, this.canvas)
    this.shipModel = new Ship(this.canvas.width / 2, 20, 48, 48)
    this.song?.play()
  }
  
  async loadContent(): Promise<unknown> {
    this.shipImage = await loadImage('../../../assets/ship.png')
    this.song = loadAudio('../../../assets/song.wav')
    this.thruster = loadAudio('../../../assets/thruster.wav')
    this.success = loadAudio('../../../assets/success.wav')
    this.explode = loadAudio('../../../assets/explode.wav')
    
    
    this.song.loop = true
    this.song.volume = 0.35
    this.thruster.volume = 0.5
    this.success.volume = 1
    this.explode.volume = 0.65
    return
  }
  processInput(deltaTime: number): StateEnum {
    if (!this.paused) {
      if (this.shipModel!.handleInput(deltaTime, this.canvas.keyboard)) {
        this.thruster!.play()
        this.thruster!.play
      } else {
        this.thruster!.pause()
      }
    }
    if (this.canvas.keyboard.isPressed('Space')) {
      if (!this.temp) {
        this.paused = !this.paused
        this.temp = true
      }
    } else if (this.canvas.keyboard.isPressed('Enter')) {
      if (!this.temp) {
        this.line = generateTerrain(2, this.canvas)
        this.temp = true
      }
    } else {
      this.temp = false
    }
    if (this.canvas.keyboard.isPressed('Escape')) {
      return StateEnum.Menu
    } else {
      return StateEnum.Play
    }
  }
  update(deltaTime: number): void {
    if (!this.paused) {
      this.shipModel!.update(deltaTime)
      const circle = {
        center: this.shipModel!.pos.addCopy(this.shipModel!.size.scaleCopy(0.5)),
        radius: this.shipModel!.size.x / 2
      }
      for (const line of this.line!.lines()) {
        if (lineCircleIntersection(line[0], line[1], circle)) {
          console.log(line)
          if (
            line[2] && // intersected with safe zone
            circle.center.x - circle.radius * 0.4 >= line[0].x &&
            circle.center.x + circle.radius * 0.4 <= line[1].x // In bounds
          ) {
            this.win()
            break
          } else {
            this.lose()
            break
          }
        }
      }
    }
  }
  render(_deltaTime: number): void {
    this.drawTerrain()
    this.drawShip()
  }
  
  exit() {
    this.song!.pause()
    this.thruster!.pause()
    this.song!.currentTime = 0
  }
  
  private drawTerrain () {
    const {
      context,
      width,
      height
    } = this.canvas
    context.save()
    context.beginPath()
    
    const first = this.line!.vertices[0]
    context.moveTo(first.x, first.y)
    this.line!.vertices.forEach(v => {
      context.lineTo(v.x, v.y)
    })
    context.lineTo(width, height)
    context.lineTo(0, height)
    context.closePath()
    context.fillStyle = 'gray'
    context.fill()
    context.restore()
  }
  
  private drawShip () {
    const context = this.canvas.context
    const {
      pos,
      rot,
      size
    } = this.shipModel!
    const halfSize = size.scaleCopy(0.5)
    context.save()
    context.translate(pos.x + halfSize.x, pos.y + halfSize.y)
    context.rotate(rot + Math.PI / 2)
    context.drawImage(this.shipImage!, -halfSize.x , -halfSize.y, size.x, size.y)
    context.restore()
  }
  
  private win () {
    this.won = true
    this.paused = true
    this.success!.play()
  }
  
  private lose () {
    this.paused = true
    this.explode!.play()
  }
}
