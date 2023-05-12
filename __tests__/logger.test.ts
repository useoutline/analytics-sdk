import logger from '../lib/logger'
import state from '../lib/state'

describe('Logger', () => {
  const spy = jest.spyOn(console, 'log')

  test('Log with debug true', () => {
    state.setState({ debug: true })
    logger.log('test')
    expect(spy).toHaveBeenCalledWith('[Outline Logger]', 'test')
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })
})
