import { randomNormal } from "@/algorithms/randomNormal";
import { randomUniform } from "@/algorithms/randomUniform";
import { Particle, ParticleGenerator, Shape } from "@/game-lib/Particles";

export class ExplosionGenerator implements ParticleGenerator {
  public speed = 110
  
  constructor (
    public x: number,
    public y: number
  ) {}
  
  spawn(): Array<Particle> {
    return Array.from(new Array(200), (_s, i) => {
      if (i % 2 === 0) {
        return this.makeFire()
      } else {
        return this.makeSmoke()
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
      span: randomNormal() * 830 + 3000,
      now: 0,
      maxSpeed: 2190,
      shape: Shape.ELLIPSE
    }
  }
  
  private thrustAngle (angle: number, speed: number): { vx: number, vy: number, ax?: number, ay?: number } {
    return {
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      ax: - Math.cos(angle) * speed / 4,
      ay: - Math.sin(angle) * speed / 4,
    }
  }
  
  private makeFire (): Particle {
    return {
      ...this.makePartialParticle(this.x, this.y, 30, 60, 30),
      ...this.thrustAngle(randomUniform(0, Math.PI * 2), Math.sqrt(Math.random()) * this.speed),
      color: [randomNormal() * 20 + 200, randomNormal() * 10 + 100, randomNormal() * 10 + 30, 0.15]
    }
  }
  
  private makeSmoke (): Particle {
    const grayscale = randomNormal() * 30 + 100
    return {
      ...this.makePartialParticle(this.x, this.y, 30, 60, 30),
      ...this.thrustAngle(randomUniform(0, Math.PI * 2), Math.sqrt(Math.random()) * this.speed),
      color: [randomNormal() * 5 + grayscale, randomNormal() * 5 + grayscale, randomNormal() * 5 + grayscale, 0.15]
    }
  }
}
