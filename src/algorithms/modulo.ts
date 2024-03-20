export function modulo(n: number, d: number): number {
  return (d + n % d) % d
}
