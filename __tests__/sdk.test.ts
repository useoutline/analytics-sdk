import useOutlineAnalytics from '../lib/index'
import state from '../lib/state'

jest.mock('@/apis', () => {
  return {
    createApiInstance: jest.fn(),
    getVisitorUid: jest.fn(() => Promise.resolve('OAU-test')),
    getTrackingEvents: jest.fn(() => Promise.resolve([])),
    trackEvent: jest.fn(() => Promise.resolve({ success: true })),
    trackSession: jest.fn(() => Promise.resolve({ success: true })),
  }
})

localStorage.setItem = jest.fn()
localStorage.getItem = jest.fn(() => null)
sessionStorage.setItem = jest.fn()
sessionStorage.getItem = jest.fn(() => null)

describe('Initialize SDK and use functions', () => {
  test('Initialize SDK success and test pagehide event', async () => {
    const analytics = await useOutlineAnalytics('OA-test', {
      serverUrl: 'http://localhost',
      mock: true,
      debug: true,
    })
    expect(analytics).toBeDefined()
    expect(analytics.start).toBeInstanceOf(Function)
    expect(analytics.stop).toBeInstanceOf(Function)
    expect(analytics.sendEvent).toBeInstanceOf(Function)
    const spy = jest.spyOn(console, 'log')
    window.addEventListener('pagehide', () => {
      expect(spy).toHaveBeenLastCalledWith(
        '[Outline Logger]',
        'Page session ended',
        '"/"'
      )
    })
    window.dispatchEvent(new CustomEvent('pagehide'))
  })

  test('Start and stop tracking success', async () => {
    const spy = jest.spyOn(console, 'log')
    const analytics = await useOutlineAnalytics('OA-test', {
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
    const spy = jest.spyOn(console, 'log')
    const analytics = await useOutlineAnalytics('OA-test', {
      serverUrl: 'http://localhost',
      mock: true,
      debug: true,
    })
    analytics.start()
    analytics.sendEvent('test')
    expect(spy).toHaveBeenLastCalledWith(
      '[Outline Logger]',
      'Custom event',
      '"test"'
    )
    analytics.setData({ test: 'test' })
    expect(state.value.data).toEqual({ test: 'test' })
    window.addEventListener('pageshow', () => {
      expect(spy).toHaveBeenLastCalledWith(
        '[Outline Logger]',
        'Page session started',
        '"/"'
      )
    })
    const customEvent = new CustomEvent('pageshow')
    // @ts-ignore
    customEvent.persisted = true
    window.dispatchEvent(customEvent)
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })
})
