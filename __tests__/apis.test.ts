import {
  createApiInstance,
  getTrackingEvents,
  getVisitorUid,
  trackEvent,
  trackSession,
} from '../lib/apis'
import state from '../lib/state'

fetch = jest.fn((url) => {
  if (url.includes('/OA-test/id')) {
    return Promise.resolve({
      json: () => Promise.resolve({ id: 'OAU-test' }),
    })
  }
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

  test('Get VisitorUid', async () => {
    const uid = await getVisitorUid()
    expect(uid).toEqual('OAU-test')
  })

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
    ;(window.navigator as any).brave = {
      isBrave: true,
    }
    const startTimestamp = Date.now()
    const endTimestamp = Date.now()
    await trackSession(
      { path: '/test' },
      startTimestamp.toString(),
      endTimestamp.toString()
    )
    expect(fetch).toHaveLastReturnedWith(
      Promise.resolve({ json: () => Promise.resolve({ success: true }) })
    )
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })
})
