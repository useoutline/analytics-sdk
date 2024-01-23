import { getRandomValue } from '../../lib/methods/randomValues'

describe('Random values', () => {
  test('Get random value', () => {
    const value = getRandomValue()
    expect(value).toContain('-')
    expect(value.split('-').length).toBe(4)
    expect(value.split('-').join('')).toHaveLength(32)
  })
})
