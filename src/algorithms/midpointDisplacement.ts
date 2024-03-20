import { randomNormal } from "./randomNormal"
import { randomUniform } from "./randomUniform"

class Point {
  constructor (public x: number, public y: number) {}
  
  static midpoint (p1: Point, p2: Point): Point {
    return new Point((p1.x + p2.x) / 2, (p1.y + p2.y) / 2)
  }
  
  static *fromCoords (...coords: Array<number>): Generator<Point> {
    if (coords.length % 2 !== 0) {
      throw new Error('fromPoints called with an odd number of coordinates')
    } else {
      for (let i = 0; i < coords.length; i+=2) {
        yield new Point(coords[i], coords[i + 1])
      }
    }
  }
}

/**
 * Safety should be added after generating terrain
 */
class Line {
  vertices: Array<Point>
  splits = 1
  safe: Array<{x: number, width: number}>
  constructor (x1: number, y1: number, x2: number, y2: number) {
    this.vertices = Array.from(Point.fromCoords(x1, y1, x2, y2))
    this.safe = []
  }
  
  static AtHeight(y: number, width: number) {
    return new Line(0, y, 0 + width, y)
  }
  
  addSafetyBefore(x: number, y: number, width: number): boolean {
    const space = {x, width}
    const overlapped = this.safe.some(other => 
      space.x < other.x + other.width &&
      other.x < space.x + space.width
    )
    if (overlapped) {
      return false
    }
    this.safe.push({x, width})
    this.vertices.push(new Point(x, y), new Point(x + width, y))
    this.vertices.sort((a, b) => a.x - b.x)
    return true
  }
  
  addSafetyAfter(x: number, width: number): boolean {
    const space = {x, width}
    const overlapped = this.safe.some(other => 
      space.x < other.x + other.width &&
      other.x < space.x + space.width
    )
    if (overlapped) {
      return false
    }
    const lIndex = this.vertices.findIndex(p => p.x > x)
    const rIndex = this.vertices.findIndex(p => p.x > x + width)
    if (lIndex === -1 || rIndex === -1) {
      return false
    }
    this.safe.push({x, width})
    const lPoint = this.vertices[lIndex]
    const rPoint = this.vertices[rIndex - 1]
    const newY = (lPoint.y + rPoint.y) / 2
    lPoint.y = newY
    rPoint.y = newY
    this.vertices.splice(lIndex, rIndex - lIndex, lPoint, rPoint)
    return true
  }
  
  split (transformer?: (point: Point, diff: number, splits: number) => Point) {
    transformer ??= (p, _d, _s) => p
    const tempVertices: Array<Point> = this.vertices.slice(0, 1) // First element as an array
    for (let i = 1; i < this.vertices.length; i++) {
      const prev = this.vertices[i - 1] // Prev is already pushed
      const next = this.vertices[i]
      if (this.safe.some(s => Math.abs(prev.x - s.x) < 2)) {
        tempVertices.push(next)
        continue
      }
      const mid = Point.midpoint(prev, next)
      const diff = Math.abs(prev.x - next.x)
      tempVertices.push(transformer(mid, diff, this.splits))
      tempVertices.push(next)
    }
    this.vertices = tempVertices
    this.splits++
  }
}

export class ReadyLine {
  vertices: Array<Point>
  safe: Array<{x: number, width: number}>
  constructor (line: Line) {
    this.vertices = line.vertices.slice()
    this.safe = line.safe.slice()
  }
  
  public *lines (): Generator<[Point, Point, boolean]> {
    for (let i = 0; i < this.vertices.length - 1; i++) {
      const curr = this.vertices[i]
      const next = this.vertices[i + 1]
      if (this.safe.some(s => Math.abs(curr.x - s.x) < 2)) {
        yield [curr, next, true]
      } else {
        yield [curr, next, false]
      }
    }
  }
}
const ROUGHNESS = 1.45
const safetyWidth = 70
const splits = 7

function midpointDisplacement (point: Point, diff: number, level: number = 1): Point {
  return new Point(
    point.x,
    Math.abs(point.y + ROUGHNESS * randomNormal() * diff)
  )
}

export function generateTerrain (safetyCount: number, canvasSize: {width: number, height: number}) {
  const { width, height } = canvasSize
  const y1 = randomUniform(height * 0.05, height * 0.4)
  const y2 = randomUniform(height * 0.05, height * 0.4)
  
  // Make line
  const line = new Line(0, y1, width, y2)
  
  // Generate safety zones
  let actualCount = 0
  const diffWidth = (width * 0.7) / safetyCount
  for (let i = 0; i < safetyCount * 5 && actualCount < safetyCount; i++) {
    const x = width * .15 + randomUniform(diffWidth * i, diffWidth * (i + 1) - safetyWidth)
    const y = randomUniform(height * 0.05, height * 0.4)
    if (line.addSafetyBefore(x, y, safetyWidth)) {
      actualCount++
    }
  }
  
  // Split line with midpoint displacement
  for (let i = 0; i < splits; i++) {
    line.split(midpointDisplacement)
  }
  
  // Flip upside down
  line.vertices.forEach(v => {
    v.y = height - v.y
  })
  
  const r = new ReadyLine(line)
  return r
}
