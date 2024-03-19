import { GameState } from "@/game-lib/GameState"
import { StateEnum } from "./views/StateEnum"
import { CanvasPlus } from "@/game-lib/CanvasPlus"
import { MenuView } from "./views/MenuView"
import { PlayView } from "./views/PlayView"

export class GameMain {
  states: Record<StateEnum, GameState<StateEnum>>
  currentState: GameState<StateEnum>
  lastTime: number
  
  constructor (
    protected canvas: CanvasPlus
  ) {
    this.states = {
      [StateEnum.Menu]: new MenuView(this.canvas),
      [StateEnum.Play]: new PlayView(this.canvas)
    }
    this.lastTime = performance.now()
    this.currentState = this.states[StateEnum.Play]
  }
  
  async loadContent () {
    return Promise.all(
      Object.values(this.states).map(state => state.loadContent())
    )
  }
  
  loop (currentTime: number) {
    const deltaTime = currentTime = this.lastTime
    const nextStateKey = this.currentState.processInput(deltaTime)
    this.currentState.update(deltaTime)
    this.currentState = this.states[nextStateKey]
    this.currentState.render(deltaTime)
    this.lastTime = currentTime
    requestAnimationFrame((nextTime) => this.loop(nextTime))
  }
}
