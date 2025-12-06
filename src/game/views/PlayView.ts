import { GameState } from "@/game-lib/GameState"
import { StateEnum } from "./StateEnum"
import { CanvasPlus } from "@/game-lib/CanvasPlus"
import { ReadyLine, generateTerrain } from "@/algorithms/midpointDisplacement"
import { loadAudio, loadImage } from "@/game-lib/loadAsset"
import { Ship } from "../models/Ship"
import { lineCircleIntersection } from "@/algorithms/intersection"
import { ScoresView } from "./ScoresView"
import { ParticleSystem } from "@/game-lib/Particles"
import { ThrustGenerator } from "../particleGenerators/ThrustGenerator"
import { ExplosionGenerator } from "../particleGenerators/ExplosionGenerator"
export class PlayView implements GameState<StateEnum> {
  private line?: ReadyLine
  private shipImage?: HTMLImageElement
  private song?: HTMLAudioElement
  private thruster?: HTMLAudioElement
  private success?: HTMLAudioElement
  private explode?: HTMLAudioElement
  private fuel = 20
  private score = 0
  private countdown = 3999
  private particleSystem: ParticleSystem
  private lJetSpawner: ThrustGenerator
  private rJetSpawner: ThrustGenerator
  private explosionSpawner: ExplosionGenerator
  
  
  
  private won = false
  private lost = false
  private level = 1
  
  private shipModel?: Ship
  
  constructor (private canvas: CanvasPlus) {
    this.particleSystem = new ParticleSystem()
    this.lJetSpawner = new ThrustGenerator(100, 100, 0)
    this.rJetSpawner = new ThrustGenerator(100, 100, 0)
    this.explosionSpawner = new ExplosionGenerator(100, 100)
    // this.particleSystem.addSpawner(new ThrustGenerator(100, 100, 0))
  }
  
  start(secondLevel: boolean = false) {
    if (!secondLevel) {
      this.score = 0
      this.level = 1
      this.line = generateTerrain(2, this.canvas)
    } else {
      this.line = generateTerrain(1, this.canvas)
    }
    this.countdown = 3999
    this.fuel = 20
    this.won = false
    this.lost = false
    this.shipModel = new Ship(this.canvas.width / 2, 20, 48, 48)
    this.song!.play()
  }
  
  async loadContent(): Promise<unknown> {
    this.shipImage = await loadImage(import.meta.resolve('../../../assets/ship2.png'))
    this.song = loadAudio(import.meta.resolve('../../../assets/song.wav'))
    this.thruster = loadAudio(import.meta.resolve('../../../assets/thruster.wav'))
    this.success = loadAudio(import.meta.resolve('../../../assets/success.wav'))
    this.explode = loadAudio(import.meta.resolve('../../../assets/explode.wav'))
    
    
    this.song.loop = true
    this.song.volume = 0.15
    this.thruster.volume = 0.5
    this.success.volume = 1
    this.explode.volume = 0.35
    return
  }
  processInput(deltaTime: number): StateEnum {
    if (this.countdown > 0) {
      
    } else if (this.won || this.lost) {
      if (this.canvas.keyboard.isPressed('Space')) {
        if (this.lost || ++this.level > 2) {
          this.start(false)
        } else {
          this.start(true)
        }
      }
    } else if (this.fuel > 0) {
      const boosters = this.shipModel!.handleInput(deltaTime, this.canvas.keyboard)
      if (boosters.some(b => b)) {
        this.thruster!.play()
        this.thruster!.play
        this.fuel -= deltaTime / 1000
        if (boosters[0]) {
          this.particleSystem.addSpawner(this.lJetSpawner)
        }
        if (boosters[1]) {
          this.particleSystem.addSpawner(this.rJetSpawner)
        }
      } else {
        this.particleSystem.removeSpawner(this.lJetSpawner)
        this.particleSystem.removeSpawner(this.rJetSpawner)
        this.thruster!.pause()
      }
    }
    if (this.canvas.keyboard.isPressed('Escape')) {
      return StateEnum.Menu
    } else {
      return StateEnum.Play
    }
  }
  update(deltaTime: number): void {
    this.explosionSpawner!.x = this.shipModel!.pos.x + this.shipModel!.size.x / 2
    this.explosionSpawner!.y = this.shipModel!.pos.y + this.shipModel!.size.y / 2
    this.lJetSpawner!.x = this.shipModel!.pos.x + this.shipModel!.size.x * 0.8 / 2 * (1.25 + Math.cos(Math.PI / 2 + this.shipModel!.rot))
    this.lJetSpawner!.y = this.shipModel!.pos.y + this.shipModel!.size.y / 2 * (1 + Math.sin(Math.PI / 2 + this.shipModel!.rot))
    this.lJetSpawner!.angle = Math.PI + this.shipModel!.rot
    this.rJetSpawner!.x = this.shipModel!.pos.x + this.shipModel!.size.x * 0.8 / 2 * (1.25 + Math.cos(-Math.PI / 2 + this.shipModel!.rot))
    this.rJetSpawner!.y = this.shipModel!.pos.y + this.shipModel!.size.y / 2 * (1 + Math.sin(-Math.PI / 2 + this.shipModel!.rot))
    this.rJetSpawner!.angle = Math.PI + this.shipModel!.rot
    
    this.particleSystem.update(deltaTime)
    this.particleSystem.removeSpawner(this.explosionSpawner)
    if (this.countdown > 0) {
      this.countdown -= deltaTime
      return
    }
    if (!this.lost && !this.won) {
      this.shipModel!.update(deltaTime)
      const circle = {
        center: this.shipModel!.pos.addCopy(this.shipModel!.size.scaleCopy(0.5)),
        radius: this.shipModel!.size.x / 2
      }
      for (const line of this.line!.lines()) {
        if (lineCircleIntersection(line[0], line[1], circle)) {
          if (
            line[2] && // intersected with safe zone
            circle.center.x - circle.radius * 0.4 >= line[0].x &&
            circle.center.x + circle.radius * 0.4 <= line[1].x && // In bounds
            this.shipModel!.rot > 4.62 && this.shipModel!.rot < 4.80 && // Correct rotation
            this.shipModel!.vel.dist() < 30
          ) {
            this.win()
            break
          } else {
            this.particleSystem.addSpawner(this.explosionSpawner)
            this.lose()
            break
          }
        }
      }
    }
  }
  render(deltaTime: number): void {
    if (this.lost) {
      this.drawShip()
      this.particleSystem.render(deltaTime, this.canvas.context)
    } else {
      this.particleSystem.render(deltaTime, this.canvas.context)
      this.drawShip()
    }
    this.drawTerrain()
    this.drawStatus()
    this.drawCountdown()
    this.drawEnd()
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
  
  private drawStatus () {
    const green = 'lime'
    const white = 'white'
    const fuel = `Fuel: ${Math.max(this.fuel, 0).toFixed(2)} s`
    const speed = `Speed: ${this.shipModel!.vel.scaleCopy(0.066).dist().toFixed(2)} m/s`
    const angle = `Angle: ${(270 - this.shipModel!.rot * 180 / Math.PI).toFixed(2)} °`
    const context = this.canvas.context
    context.save()
    context.textAlign = "right"
    context.fillStyle = green
    context.fillText(`Level ${this.level}`, this.canvas.width - 20, 20)
    context.fillStyle = this.fuel > 0 ? green : white
    context.fillText(fuel, this.canvas.width - 20, 40)
    context.fillStyle = this.shipModel!.vel.dist() < 30 ? green : white
    context.fillText(speed, this.canvas.width - 20, 60)
    context.fillStyle = this.shipModel!.rot > 4.62 && this.shipModel!.rot < 4.80 ? green : white
    context.fillText(angle, this.canvas.width - 20, 80)
    context.restore()
  }
  
  private win () {
    this.won = true
    this.score += this.fuel * 10
    this.particleSystem.removeSpawner(this.lJetSpawner)
    this.particleSystem.removeSpawner(this.rJetSpawner)
    this.thruster!.pause()
    this.success!.play()
    if (this.level === 2) {
      this.saveScore()
    }
    
  }
  
  private lose () {
    this.lost = true
    this.particleSystem.removeSpawner(this.lJetSpawner)
    this.particleSystem.removeSpawner(this.rJetSpawner)
    this.thruster!.pause()
    this.explode!.play()
    if (this.score > 0) {
      this.saveScore()
    }
  }
  
  private saveScore () {
    const scores: Array<number> = JSON.parse(localStorage.getItem(ScoresView.storeKey)!)
    scores.push(this.score)
    localStorage.setItem(ScoresView.storeKey, JSON.stringify(scores))
  }
  
  private drawCountdown () {
    const context = this.canvas.context
    if (this.countdown > 0) {
      context.save()
      context.fillStyle = 'rgba(0, 0, 0, 0.4)'
      context.fillRect(0, 0, this.canvas.width, this.canvas.height)
      context.fillStyle = 'white'
      context.font = '64pt sans-serif'
      context.textAlign = 'center'
      context.textBaseline = 'middle'
      context.fillText(String(Math.floor(this.countdown / 1000) || 'GO'), this.canvas.width / 2, this.canvas.height / 2)
      context.restore()
    }
  }
  
  private drawEnd () {
    const context = this.canvas.context
    if (this.won || this.lost) {
      const text = this.won ? {
        big: `Mission ${this.level}/2: Success`,
        score: `Score: ${Math.round(this.score)}`,
        next: this.level === 1 ? 'Next Level: Press Space' : 'Retry: Press Space',
        esc: 'Exit: Press Escape'
      } : {
        big: `Mission Failed`,
        score: `Score: ${Math.round(this.score)}`,
        next: 'Retry: Press Space',
        esc: 'Exit: Press Escape'
      }
      context.save()
      context.fillStyle = 'rgba(0, 0, 0, 0.4)'
      context.fillRect(0, 0, this.canvas.width, this.canvas.height)
      context.fillStyle = 'white'
      context.font = '32pt sans-serif'
      context.textAlign = 'center'
      context.fillText(text.big, this.canvas.width / 2, this.canvas.height / 2 - 50)
      context.fillText(text.score, this.canvas.width / 2, this.canvas.height / 2)
      context.font = '22pt sans-serif'
      context.fillText(text.next, this.canvas.width / 2, this.canvas.height / 2 + 40)
      context.fillText(text.esc, this.canvas.width / 2, this.canvas.height / 2 + 80)
      context.restore()
    }
    
  }
}
