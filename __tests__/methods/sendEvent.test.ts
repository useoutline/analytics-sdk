import { sendEvent, sendDefaultEvent } from '../../lib/methods/sendEvent'
import state from '../../lib/state'

// @ts-ignore
global.fetch = jest.fn((url: string) => {
  if (url.includes('/OA-test/events')) {
    return Promise.resolve({
      json: () => Promise.resolve({ events: [] }),
    })
  }
  return Promise.resolve({
    json: () => Promise.resolve({ success: true }),
  })
})

AbortSignal.timeout = jest.fn((timeout: number) => {
  return new AbortController().signal
})

beforeEach(() => {
  jest.clearAllMocks()
})

describe('Send Event', () => {
  test('Send Event success', async () => {
    const spy = jest.spyOn(console, 'log')
    state.setState({
      mock: false,
      debug: true,
      analyticsId: 'OA-test',
      trackingState: 'tracking',
    })
    sendEvent('test')
    expect(spy).toHaveBeenLastCalledWith(
      '[Outline Logger]',
      'Custom event',
      '"test"'
    )
  })

  test('Try send event when tracking is stopped', async () => {
    const spy = jest.spyOn(console, 'log')
    state.setState({
      mock: false,
      debug: true,
      analyticsId: 'OA-test',
      trackingState: 'stopped',
    })
    sendEvent('test')
    expect(spy).not.toHaveBeenCalled()
  })

  test('Try default send event when tracking is stopped', async () => {
    const spy = jest.spyOn(console, 'log')
    state.setState({
      mock: false,
      debug: true,
      analyticsId: 'OA-test',
      trackingState: 'stopped',
    })
    sendDefaultEvent('internal', 'test')
    expect(spy).not.toHaveBeenCalled()
  })
})
