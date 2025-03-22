import { vi, beforeEach, describe, test, expect, afterAll } from 'vitest'
import { sendEvent, sendDefaultEvent } from '../../lib/methods/sendEvent'
import state from '../../lib/state'

// @ts-expect-error - This is a test
global.fetch = vi.fn((url: string) => {
  if (url.includes('/OA-test/events')) {
    return Promise.resolve({
      json: () => Promise.resolve({ events: [] }),
    })
  }
  return Promise.resolve({
    json: () => Promise.resolve({ success: true }),
  })
})

AbortSignal.timeout = vi.fn((timeout: number) => {
  return new AbortController().signal
})

beforeEach(() => {
  vi.clearAllMocks()
})

describe('Send Event', () => {
  test('Send Event success', async () => {
    const spy = vi.spyOn(console, 'log')
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
      '"test"',
    )
  })

  test('Try send event when tracking is stopped', async () => {
    const spy = vi.spyOn(console, 'log')
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
    const spy = vi.spyOn(console, 'log')
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
