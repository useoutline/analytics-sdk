import { getRandomValue } from '../../lib/methods/randomValues'

describe('Random values', () => {
  test('Get random value', () => {
    const value = getRandomValue()
    expect(value).toHaveLength(32)
  })
})
