export function getRandomValue() {
  return window.crypto
    .getRandomValues(new Uint32Array(4))
    .toString()
    .split(',')
    .map((r) => Number(r).toString(16))
    .join('-')
}
