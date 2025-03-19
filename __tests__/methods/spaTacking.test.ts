import { enableSPATracking } from '../../lib/methods/spaTracking'
import state from '../../lib/state'
import { sendDefaultEvent } from '../../lib/methods/sendEvent'
import { startPageSession, endPageSession } from '../../lib/methods/pageSession'
import { trackEvents } from '../../lib/methods/trackEvents'

// Mock dependencies
jest.mock('@/logger', () => ({
  log: jest.fn(),
}))

jest.mock('@/methods/sendEvent', () => ({
  sendDefaultEvent: jest.fn(),
}))

jest.mock('@/methods/pageSession', () => ({
  startPageSession: jest.fn(),
  endPageSession: jest.fn(),
}))

jest.mock('@/methods/trackEvents', () => ({
  trackEvents: jest.fn(),
}))

jest.mock('@/apis', () => {
  return {
    createApiInstance: jest.fn(),
    getVisitorUid: jest.fn(() => Promise.resolve('OAU-test')),
    getTrackingEvents: jest.fn(() => Promise.resolve([])),
    trackEvent: jest.fn(() => Promise.resolve({ success: true })),
    trackSession: jest.fn(() => Promise.resolve({ success: true })),
  }
})

describe('SPA Tracking', () => {
  // Store original implementations
  const originalPushState = window.history.pushState
  const originalReplaceState = window.history.replaceState

  beforeEach(() => {
    // Reset mocks and restore original state
    jest.clearAllMocks()
    state.setState({ debug: true })

    // Create fresh spies for each test
    window.history.pushState = originalPushState
    window.history.replaceState = originalReplaceState

    // Set up current location
    Object.defineProperty(window, 'location', {
      value: {
        href: 'http://localhost/',
        pathname: '/',
      },
      writable: true,
    })

    // Reset the timeout behaviors
    jest.useFakeTimers()
  })

  afterEach(() => {
    // Restore history methods
    window.history.pushState = originalPushState
    window.history.replaceState = originalReplaceState
    jest.useRealTimers()
  })

  test('Enable SPA tracking overrides pushState method', () => {
    const historyPushStateSpy = jest.spyOn(window.history, 'pushState')

    // Enable SPA tracking
    enableSPATracking()

    // Original pushState should be replaced
    expect(window.history.pushState).not.toBe(originalPushState)
    expect(historyPushStateSpy).not.toHaveBeenCalled()

    // Trigger a navigation
    window.history.pushState({}, '', '/new-page')

    // Check endPageSession was called for the previous page
    expect(endPageSession).toHaveBeenCalledWith({
      meta: { event: 'pushState', referrer: 'http://localhost/' },
    })

    // Fast-forward timers to trigger setTimeout callback
    jest.advanceTimersByTime(1500)

    // Verify events were tracked correctly
    expect(sendDefaultEvent).toHaveBeenCalledWith('internal', 'pageview')
    expect(startPageSession).toHaveBeenCalled()
    expect(trackEvents).toHaveBeenCalled()
  })

  test('Enable SPA tracking overrides replaceState method', () => {
    const historyReplaceStateSpy = jest.spyOn(window.history, 'replaceState')

    // Enable SPA tracking
    enableSPATracking()

    // Original replaceState should be replaced
    expect(window.history.replaceState).not.toBe(originalReplaceState)
    expect(historyReplaceStateSpy).not.toHaveBeenCalled()

    // Trigger a navigation with replaceState
    window.history.replaceState({}, '', '/replaced-page')

    // Check endPageSession was called for the previous page
    expect(endPageSession).toHaveBeenCalledWith({
      meta: { event: 'replaceState', referrer: 'http://localhost/' },
    })

    // Fast-forward timers to trigger setTimeout callback
    jest.advanceTimersByTime(1500)

    // Verify events were tracked correctly
    expect(sendDefaultEvent).toHaveBeenCalledWith('internal', 'pageview')
    expect(startPageSession).toHaveBeenCalled()
    expect(trackEvents).toHaveBeenCalled()
  })

  test('Enable SPA tracking handles popstate events', () => {
    // Create a spy for the event listener
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener')

    // Enable SPA tracking
    enableSPATracking()

    // Verify popstate listener was added
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'popstate',
      expect.any(Function)
    )

    // Get the registered popstate handler
    const popstateHandler = addEventListenerSpy.mock.calls.find(
      (call) => call[0] === 'popstate'
    )?.[1] as EventListener

    // Simulate popstate event
    popstateHandler(new Event('popstate'))

    // First the existing tracking events should be removed
    expect(trackEvents).toHaveBeenCalledWith({ remove: true })

    // End the previous page session
    expect(endPageSession).toHaveBeenCalled()

    // Fast-forward timers to trigger setTimeout callback
    jest.advanceTimersByTime(1500)

    // Verify events were tracked correctly after popstate
    expect(sendDefaultEvent).toHaveBeenCalledWith('internal', 'pageview')
    expect(startPageSession).toHaveBeenCalled()
    expect(trackEvents).toHaveBeenCalledTimes(2) // Once for remove, once for add
  })

  test('Multiple history navigations are tracked correctly', () => {
    // Enable SPA tracking
    enableSPATracking()

    // First navigation
    window.history.pushState({}, '', '/page-1')
    jest.advanceTimersByTime(1500)

    // Reset mocks
    jest.clearAllMocks()

    // Update location mock for second navigation
    Object.defineProperty(window, 'location', {
      value: {
        href: 'http://localhost/page-1',
        pathname: '/page-1',
      },
      writable: true,
    })

    // Second navigation
    window.history.pushState({}, '', '/page-2')

    // Check endPageSession was called for the previous page
    expect(endPageSession).toHaveBeenCalledWith({
      meta: { event: 'pushState', referrer: 'http://localhost/page-1' },
    })

    jest.advanceTimersByTime(1500)

    // Verify events were tracked correctly
    expect(sendDefaultEvent).toHaveBeenCalledWith('internal', 'pageview')
    expect(startPageSession).toHaveBeenCalled()
    expect(trackEvents).toHaveBeenCalled()
  })
})
