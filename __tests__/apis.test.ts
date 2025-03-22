import { vi, beforeEach, describe, test, expect, Mock } from 'vitest'
import {
  createApiInstance,
  getTrackingEvents,
  trackEvent,
  trackSession,
} from '../lib/apis'
import state from '../lib/state'

// Mock fetch
global.fetch = vi.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ events: [] }),
    ok: true,
  }),
) as Mock

// Mock AbortController
global.AbortController = vi.fn().mockImplementation(() => ({
  abort: vi.fn(),
  signal: {},
}))

// Mock clear timeout
global.clearTimeout = vi.fn()

// Mock sendBeacon
const mockSendBeacon = vi.fn().mockReturnValue(true)
Object.defineProperty(global.navigator, 'sendBeacon', {
  value: mockSendBeacon,
  writable: true,
})

const mockBlob = vi.fn().mockReturnValue({})
global.Blob = mockBlob as unknown as typeof Blob

beforeEach(() => {
  vi.clearAllMocks()
  state.setState({
    analyticsId: 'OA-test',
    mock: false,
    visitorUid: 'test-uid',
  })
})

describe('API Tests', () => {
  test('Create API instance', () => {
    createApiInstance('https://api.test.com', 'v1')
    expect(state.value.analyticsId).toBe('OA-test')
  })

  test('Get tracking events succeeds', async () => {
    const events = await getTrackingEvents()
    expect(fetch).toHaveBeenCalled()
    expect(events).toEqual([])
  })

  test('Get tracking events handles errors gracefully', async () => {
    // Override fetch to simulate an error
    global.fetch = vi.fn(() => Promise.reject('API error')) as Mock
    console.error = vi.fn()

    const events = await getTrackingEvents()

    // Should return empty array on error
    expect(events).toEqual([])
    expect(console.error).toHaveBeenCalled()
  })

  test('Track event uses fetch for regular events', () => {
    const testPage = {
      fullpath: 'http://localhost/',
      title: 'Test',
      referrer: '',
    }
    trackEvent('external', 'test-event', testPage, { key: 'value' })

    // Should use fetch for external events
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/event'),
      expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('test-event'),
      }),
    )
    expect(mockSendBeacon).not.toHaveBeenCalled()
  })

  test('Track event uses beacon API for internal events', () => {
    const testPage = {
      fullpath: 'http://localhost/',
      title: 'Test',
      referrer: '',
    }
    trackEvent('internal', 'pageview', testPage)

    // Should use beacon API for internal events
    expect(mockBlob).toHaveBeenCalledWith(
      [expect.stringContaining('pageview')],
      { type: 'application/json' },
    )
    expect(mockSendBeacon).toHaveBeenCalled()
    expect(fetch).not.toHaveBeenCalled()
  })

  test('Track event falls back to fetch if beacon fails', () => {
    // Make beacon fail
    mockSendBeacon.mockImplementationOnce(() => {
      throw new Error('Beacon failed')
    })

    const testPage = {
      fullpath: 'http://localhost/',
      title: 'Test',
      referrer: '',
    }
    trackEvent('internal', 'pageview', testPage)

    // Should fall back to fetch
    expect(fetch).toHaveBeenCalled()
  })

  test('Track session uses beacon API', () => {
    const testPage = {
      fullpath: 'http://localhost/',
      title: 'Test',
      referrer: '',
    }
    trackSession(testPage, 1000, 2000)

    // Should use beacon API
    expect(mockSendBeacon).toHaveBeenCalled()
    expect(fetch).not.toHaveBeenCalled()
  })

  test('Mock mode skips sending requests', () => {
    state.setState({ mock: true })

    const testPage = {
      fullpath: 'http://localhost/',
      title: 'Test',
      referrer: '',
    }
    trackEvent('external', 'test-event', testPage)
    trackSession(testPage, 1000, 2000)

    // No requests should be sent in mock mode
    expect(fetch).not.toHaveBeenCalled()
    expect(mockSendBeacon).not.toHaveBeenCalled()
  })
})
