import { vi, beforeEach, describe, test, expect, afterEach } from 'vitest'
import { enableSPATracking } from '../../lib/methods/spaTracking'
import state from '../../lib/state'
import { sendDefaultEvent } from '../../lib/methods/sendEvent'
import { startPageSession, endPageSession } from '../../lib/methods/pageSession'
import { trackEvents } from '../../lib/methods/trackEvents'

// Mock dependencies
vi.mock('@/logger', () => ({
  default: {
    log: vi.fn(),
  },
}))

vi.mock('@/methods/sendEvent', () => ({
  sendDefaultEvent: vi.fn(),
}))

vi.mock('@/methods/pageSession', () => ({
  startPageSession: vi.fn(),
  endPageSession: vi.fn(),
}))

vi.mock('@/methods/trackEvents', () => ({
  trackEvents: vi.fn(),
}))

vi.mock('@/apis', () => {
  return {
    createApiInstance: vi.fn(),
    getVisitorUid: vi.fn(() => Promise.resolve('OAU-test')),
    getTrackingEvents: vi.fn(() => Promise.resolve([])),
    trackEvent: vi.fn(() => Promise.resolve({ success: true })),
    trackSession: vi.fn(() => Promise.resolve({ success: true })),
  }
})

describe('SPA Tracking', () => {
  // Store original implementations
  const originalPushState = window.history.pushState
  const originalReplaceState = window.history.replaceState

  beforeEach(() => {
    // Reset mocks and restore original state
    vi.clearAllMocks()
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
    vi.useFakeTimers()
  })

  afterEach(() => {
    // Restore history methods
    window.history.pushState = originalPushState
    window.history.replaceState = originalReplaceState
    vi.useRealTimers()
  })

  test('Enable SPA tracking overrides pushState method', () => {
    const historyPushStateSpy = vi.spyOn(window.history, 'pushState')

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
    vi.advanceTimersByTime(1500)

    // Verify events were tracked correctly
    expect(sendDefaultEvent).toHaveBeenCalledWith('internal', 'pageview')
    expect(startPageSession).toHaveBeenCalled()
    expect(trackEvents).toHaveBeenCalled()
  })

  test('Enable SPA tracking overrides replaceState method', () => {
    const historyReplaceStateSpy = vi.spyOn(window.history, 'replaceState')

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
    vi.advanceTimersByTime(1500)

    // Verify events were tracked correctly
    expect(sendDefaultEvent).toHaveBeenCalledWith('internal', 'pageview')
    expect(startPageSession).toHaveBeenCalled()
    expect(trackEvents).toHaveBeenCalled()
  })

  test('Enable SPA tracking handles popstate events', () => {
    // Create a spy for the event listener
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener')

    // Enable SPA tracking
    enableSPATracking()

    // Verify popstate listener was added
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'popstate',
      expect.any(Function),
    )

    // Get the registered popstate handler
    const popstateHandler = addEventListenerSpy.mock.calls.find(
      (call) => call[0] === 'popstate',
    )?.[1] as EventListener

    // Simulate popstate event
    popstateHandler(new Event('popstate'))

    // First the existing tracking events should be removed
    expect(trackEvents).toHaveBeenCalledWith({ remove: true })

    // End the previous page session
    expect(endPageSession).toHaveBeenCalled()

    // Fast-forward timers to trigger setTimeout callback
    vi.advanceTimersByTime(1500)

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
    vi.advanceTimersByTime(1500)

    // Reset mocks
    vi.clearAllMocks()

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

    vi.advanceTimersByTime(1500)

    // Verify events were tracked correctly
    expect(sendDefaultEvent).toHaveBeenCalledWith('internal', 'pageview')
    expect(startPageSession).toHaveBeenCalled()
    expect(trackEvents).toHaveBeenCalled()
  })
})
