import { modulo } from "@/algorithms/modulo"
import { KeyboardHandler } from "@/game-lib/input/KeyboardHandler"
import { KeyId, inputKeys } from "../controls"

class Vec {
  constructor (public x: number, public y: number) {}
  static zero(): Vec {
    return new Vec(0, 0)
  }
  static polar (angle: number, magnitude: number): Vec {
    return new Vec(
      Math.cos(angle) * magnitude,
      Math.sin(angle) * magnitude
    )
  }
  addCopy (other: Vec): Vec {
    return new Vec(
      this.x + other.x,
      this.y + other.y
    )
  }
  addMut (other: Vec): Vec {
    this.x += other.x,
    this.y += other.y
    return this
  }
  scaleCopy (scalar: number): Vec {
    return new Vec(
      this.x * scalar,
      this.y * scalar
    )
  }
  scaleMut (scalar: number): Vec {
    this.x *= scalar
    this.y *= scalar
    return this
  }
  dist (): number {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2))
  }
  clampDistMut (magnitude: number) {
    const dist = this.dist()
    if (dist > magnitude) {
      this.scaleMut(magnitude / dist)
    }
  }
}

export class Ship {
  private static readonly GRAVITY = new Vec(0, 27)
  private static readonly THRUST = 60
  private static readonly MAX_SPEED = 90
  private static readonly TIME_SCALE = 0.001
  private static readonly ROT_VEL = 1
  
  rot: number
  pos: Vec
  size: Vec
  vel: Vec
  
  constructor (x: number, y: number, w: number, h: number) {
    this.pos = new Vec(x, y)
    this.size = new Vec(w, h)
    this.vel = new Vec(0, 0)
    this.rot = -Math.PI / 2
  }
  
  update (deltaTime: number) {
    this.rot = modulo(this.rot, Math.PI * 2)
    this.vel.clampDistMut(Ship.MAX_SPEED)
    this.pos.addMut(this.vel.scaleCopy(deltaTime * Ship.TIME_SCALE))
    this.vel.addMut(Ship.GRAVITY.scaleCopy(deltaTime * Ship.TIME_SCALE))
  }
  
  handleInput (deltaTime: number, keyboard: KeyboardHandler): [boolean, boolean] {
    const boosters: [boolean, boolean] = [false, false]
    // if (keyboard.isPressed(inputKeys[KeyId.Down].key)) {
    //   this.vel.addMut(Vec.polar(this.rot + Math.PI, Ship.THRUST).scaleMut(deltaTime * Ship.TIME_SCALE))
    //   boosters[0] -= 1
    //   boosters[1] -= 1
    // }
    if (keyboard.isPressed(inputKeys[KeyId.Up].key)) {
      this.vel.addMut(Vec.polar(this.rot, Ship.THRUST).scaleMut(deltaTime * Ship.TIME_SCALE))
      boosters[0] = true
      boosters[1] = true
    }
    if (keyboard.isPressed(inputKeys[KeyId.Left].key)) {
      this.rot -= Ship.ROT_VEL * deltaTime * Ship.TIME_SCALE
      boosters[0] = true
    }
    if (keyboard.isPressed(inputKeys[KeyId.Right].key)) {
      this.rot += Ship.ROT_VEL * deltaTime * Ship.TIME_SCALE
      boosters[1] = true
    }
    return boosters
  }
}
