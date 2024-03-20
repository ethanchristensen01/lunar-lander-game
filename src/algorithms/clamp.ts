export function clamp (min: number, max: number, n: number) {
  return Math.max(min, Math.min(max, n))
}
