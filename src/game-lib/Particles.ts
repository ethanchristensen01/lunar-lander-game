export enum Shape {
  SQUARE,
  ELLIPSE
}

export interface ParticleGenerator {
  spawn: (deltaTime: number) => Array<Particle>
}

export interface Particle {
  x: number,
  y: number,
  w: number,
  h: number,
  vx: number,
  vy: number,
  ax: number,
  ay: number,
  rot: number,
  rv: number,
  rf: number,
  span: number,
  now: number,
  maxSpeed: number,
  color: [number, number, number, number?],
  shape: Shape
}

export class ParticleSystem {
  private particles: Set<Particle> = new Set()
  private spawners: Set<ParticleGenerator> = new Set()
  public update(deltaTime: number) {
    for (const s of this.spawners.values()) {
      for (const p of s.spawn(deltaTime)) {
        this.particles.add(p)
      }
    }
    for (const p of this.particles.values()) {
      p.now += deltaTime
      if (p.now > p.span) {
        this.particles.delete(p)
      }
      p.vx += p.ax * deltaTime / 1000
      p.vy += p.ay * deltaTime / 1000
      p.rv *= Math.pow(Math.E, -p.rf * deltaTime / 1000)
      const speed = Math.sqrt(Math.pow(p.vx, 2) + Math.pow(p.vx, 2))
      if (speed > p.maxSpeed) {
        p.vx = p.vx * (p.maxSpeed / speed)
        p.vy = p.vy * (p.maxSpeed / speed)
      }
      p.x += p.vx * deltaTime / 1000
      p.y += p.vy * deltaTime / 1000
      p.rot += p.rv * deltaTime / 1000
    }
  }
  
  public render(_deltaTime: number, context: CanvasRenderingContext2D) {
    for (const p of this.particles.values()) {
      context.save()
      context.fillStyle = `rgba(${p.color.join(',')})`
      context.translate(p.x, p.y)
      context.rotate(p.rot)
      switch (p.shape) {
        case Shape.ELLIPSE: 
          context.beginPath()
          context.ellipse(0, 0, p.w / 2, p.h / 2, 0, 0, 2 * Math.PI)
          context.fill()
          break
        case Shape.SQUARE:
          context.fillRect(-p.w / 2, -p.h / 2, p.w, p.h)
          break
      }
      context.restore()
    }
  }
  
  public addSpawner (p: ParticleGenerator) {
    this.spawners.add(p)
  }
  
  public removeSpawner (p: ParticleGenerator) {
    this.spawners.delete(p)
  }
  
  public removeAllSpawners () {
    this.spawners.clear()
  }
  
  public clearParticles () {
    this.particles.clear()
  }
}
