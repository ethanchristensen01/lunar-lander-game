import { GameState } from "@/game-lib/GameState"
import { StateEnum } from "./views/StateEnum"
import { CanvasPlus } from "@/game-lib/CanvasPlus"
import { MenuView } from "./views/MenuView"
import { PlayView } from "./views/PlayView"
import { ControlsView } from "./views/ControlsView"
import { ScoresView } from "./views/ScoresView"
import { CreditsView } from "./views/CreditsView"
import { loadImage } from "@/game-lib/loadAsset"
export class GameMain {
  states: Record<StateEnum, GameState<StateEnum>>
  currentStateKey: StateEnum
  lastTime: number
  background: HTMLImageElement | undefined
  
  constructor (
    protected canvas: CanvasPlus
  ) {
    this.states = {
      [StateEnum.Menu]: new MenuView(this.canvas),
      [StateEnum.Play]: new PlayView(this.canvas),
      [StateEnum.Controls]: new ControlsView(this.canvas),
      [StateEnum.Scores]: new ScoresView(this.canvas),
      [StateEnum.Credits]: new CreditsView(this.canvas)
    }
    this.lastTime = performance.now()
    this.currentStateKey = StateEnum.Menu
  }
  
  async loadContent () {
    this.background = await loadImage('../../assets/space.png')
    return Promise.all(
      Object.values(this.states).map(state => state.loadContent())
    )
  }
  
  loop (currentTime: number) {
    this.canvas.context.save()
    this.canvas.context.fillStyle = "rgba(0, 0, 0, 0.75)"
    this.canvas.context.drawImage(this.background!, 0, 0, this.canvas.width, this.canvas.height)
    this.canvas.context.fillRect(0, 0, this.canvas.width, this.canvas.height)
    this.canvas.context.restore()
    const deltaTime = currentTime - this.lastTime
    let currentState = this.states[this.currentStateKey]
    const nextStateKey = currentState.processInput(deltaTime)
    if (this.currentStateKey !== nextStateKey) {
      this.states[this.currentStateKey].exit()
      this.currentStateKey = nextStateKey
      currentState = this.states[this.currentStateKey]
      currentState.start()
    }
    currentState.update(deltaTime)
    currentState.render(deltaTime)
    this.lastTime = currentTime
    requestAnimationFrame((nextTime) => this.loop(nextTime))
  }
}
