import { vi, describe, test, expect, afterAll } from 'vitest'
import logger from '../lib/logger'
import state from '../lib/state'

describe('Logger', () => {
  const spy = vi.spyOn(console, 'log')

  test('Log with debug true', () => {
    state.setState({ debug: true })
    logger.log('test')
    expect(spy).toHaveBeenCalledWith('[Outline Logger]', 'test')
  })

  afterAll(() => {
    vi.restoreAllMocks()
  })
})
