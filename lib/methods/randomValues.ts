export function getRandomValue() {
  return window.crypto
    .getRandomValues(new Uint32Array(4))
    .toString()
    .split(',')
    .map((r, i) => (Number(r) * (i + 1)).toString(36).padStart(8, '0'))
    .join('-')
}
