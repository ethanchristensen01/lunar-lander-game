import { randomNormal } from "@/algorithms/randomNormal";
import { randomUniform } from "@/algorithms/randomUniform";
import { Particle, ParticleGenerator, Shape } from "@/game-lib/Particles";

export class ThrustGenerator implements ParticleGenerator {
  public coneAngle = 0.6 // 2 * radian / 3
  public speed = 190
  public meanRadius = 10
  public stdevRadius = 2
  public rate = 20
  private cooldown = 0
  
  constructor (
    public x: number,
    public y: number,
    public angle: number
  ) {}
  
  spawn(deltaTime: number): Array<Particle> {
    this.cooldown -= deltaTime
    let count = 0
    while (this.cooldown <= 0) {
      this.cooldown += 1000 / this.rate
      count++
    }
    if (count === 0) {
      return []
    }
    return Array.from(new Array(count * 3), (_s, i) => {
      if (i % 2 === 0) {
        const fireAngle = randomNormal() * this.coneAngle + this.angle
        return this.makeFire(fireAngle)
      } else {
        const smokeAngle = randomNormal() * this.coneAngle + this.angle
        return this.makeSmoke(smokeAngle)
      }
    })
  }
  
  private makePartialParticle (x: number, y: number, spread: number, radius: number, rDiff: number): Particle {
    return {
      x: randomNormal() * spread + x,
      y: randomNormal() * spread + y,
      w: (randomNormal() * rDiff + radius) / 2,
      h: (randomNormal() * rDiff + radius) / 2,
      vx: 0,
      vy: 0,
      ax: 0,
      ay: 27,
      rot: 0,
      rv: 0,
      rf: 0,
      color: [255, 255, 255, 1],
      span: randomNormal() * 150 + 600,
      now: randomUniform(0, 150),
      maxSpeed: 2190,
      shape: Shape.ELLIPSE
    }
  }
  
  private thrustAngle (angle: number, speed: number): { vx: number, vy: number } {
    return {
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed
    }
  }
  
  private makeFire (angle: number): Particle {
    return {
      ...this.makePartialParticle(this.x, this.y, 5, 12, 2),
      ...this.thrustAngle(angle, this.speed),
      color: [randomNormal() * 20 + 200, randomNormal() * 10 + 100, randomNormal() * 10 + 30, 0.5]
    }
  }
  
  private makeSmoke (angle: number): Particle {
    const grayscale = randomNormal() * 30 + 100
    return {
      ...this.makePartialParticle(this.x, this.y, 15, 15, 3),
      ...this.thrustAngle(angle, this.speed),
      color: [randomNormal() * 5 + grayscale, randomNormal() * 5 + grayscale, randomNormal() * 5 + grayscale, 0.5]
    }
  }
}
