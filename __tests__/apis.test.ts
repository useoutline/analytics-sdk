import {
  createApiInstance,
  getTrackingEvents,
  trackEvent,
  trackSession,
} from '../lib/apis'
import state from '../lib/state'

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

localStorage.setItem = jest.fn()
localStorage.getItem = jest.fn(() => null)

describe('APIs', () => {
  state.setState({ analyticsId: 'OA-test' })
  createApiInstance('http://localhost', 'v1')

  test('Get Tracking Events', async () => {
    const events = await getTrackingEvents()
    expect(events).toEqual([])
  })

  test('Track Event', async () => {
    await trackEvent('internal', 'test')
    expect(fetch).toHaveLastReturnedWith(
      Promise.resolve({ json: () => Promise.resolve({ success: true }) })
    )
  })

  test('Track Session', async () => {
    ;(window.navigator as Navigator).brave = {
      isBrave: Promise.resolve(() => true),
    }
    const startTimestamp = Date.now()
    const endTimestamp = Date.now()
    await trackSession({ path: '/test' }, startTimestamp, endTimestamp)
    expect(fetch).toHaveLastReturnedWith(
      Promise.resolve({ json: () => Promise.resolve({ success: true }) })
    )
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })
})
