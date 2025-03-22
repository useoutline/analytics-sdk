import { vi, beforeEach, describe, test, expect, afterAll } from 'vitest'
import useOutlineAnalytics from '../lib/index'
import state from '../lib/state'

vi.mock('@/apis', () => {
  return {
    createApiInstance: vi.fn(),
    getVisitorUid: vi.fn(() => Promise.resolve('OAU-test')),
    getTrackingEvents: vi.fn(() => Promise.resolve([])),
    trackEvent: vi.fn(() => Promise.resolve({ success: true })),
    trackSession: vi.fn(() => Promise.resolve({ success: true })),
  }
})

localStorage.setItem = vi.fn()
localStorage.getItem = vi.fn(() => null)
sessionStorage.setItem = vi.fn()
sessionStorage.getItem = vi.fn(() => null)

beforeEach(() => {
  vi.clearAllMocks()
})

describe('Initialize SDK and use functions', () => {
  test('Initialize SDK success and test pagehide event', async () => {
    const analytics = useOutlineAnalytics('OA-test', {
      serverUrl: 'http://localhost',
      mock: true,
      debug: true,
    })
    expect(analytics).toBeDefined()
    expect(analytics.start).toBeInstanceOf(Function)
    expect(analytics.stop).toBeInstanceOf(Function)
    expect(analytics.sendEvent).toBeInstanceOf(Function)
    const spy = vi.spyOn(console, 'log')
    window.addEventListener('pagehide', () => {
      expect(spy).toHaveBeenLastCalledWith(
        '[Outline Logger]',
        'Page session ended',
        '"/"',
      )
    })
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('pagehide'))
    }, 1000)
  })

  test('Start and stop tracking success', async () => {
    const spy = vi.spyOn(console, 'log')
    const analytics = useOutlineAnalytics('OA-test', {
      serverUrl: 'http://localhost',
      mock: true,
      debug: true,
    })
    analytics.start()
    expect(spy).toHaveBeenLastCalledWith('[Outline Logger]', 'Tracking started')
    analytics.stop()
    expect(spy).toHaveBeenLastCalledWith('[Outline Logger]', 'Tracking stopped')
  })

  test('Send Event success', async () => {
    const spy = vi.spyOn(console, 'log')
    const analytics = useOutlineAnalytics('OA-test', {
      serverUrl: 'http://localhost',
      debug: true,
    })
    analytics.start()
    analytics.sendEvent('test')
    expect(spy).toHaveBeenLastCalledWith(
      '[Outline Logger]',
      'Custom event',
      '"test"',
    )
    analytics.setData({ test: 'test' })
    expect(state.value.data).toEqual({ test: 'test' })
    window.addEventListener('pageshow', () => {
      expect(spy).toHaveBeenLastCalledWith(
        '[Outline Logger]',
        'Page session started',
        '"/"',
      )
    })
    const customEvent = new CustomEvent('pageshow')
    // @ts-expect-error - This is a test
    customEvent.persisted = true
    setTimeout(() => {
      window.dispatchEvent(customEvent)
    }, 1000)
  })

  afterAll(() => {
    vi.restoreAllMocks()
  })
})
