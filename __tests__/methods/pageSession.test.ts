import { startPageSession, endPageSession } from '../../lib/methods/pageSession'
import state from '../../lib/state'

jest.mock('@/apis', () => {
  return {
    trackSession: jest.fn(() => Promise.resolve({ success: true })),
  }
})

describe('Page session', () => {
  state.setState({
    trackingState: 'tracking',
    debug: true,
  })
  test('Start page session', () => {
    const spy = jest.spyOn(console, 'log')
    startPageSession()
    expect(spy).toHaveBeenLastCalledWith(
      '[Outline Logger]',
      'Page session started',
      '"/"'
    )
  })

  test('End page session', () => {
    const spy = jest.spyOn(console, 'log')
    endPageSession()
    expect(spy).toHaveBeenLastCalledWith(
      '[Outline Logger]',
      'Page session ended',
      '"/"'
    )
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })
})
