import { enableSPATracking } from '../../lib/methods/spaTracking'
import state from '../../lib/state'

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
  test('Enable SPA tracking', (done) => {
    state.setState({ debug: true })
    const historyPushstateSpy = jest.spyOn(window.history, 'pushState')
    enableSPATracking()
    history.pushState('/test', 'Test', '/test')
    expect(historyPushstateSpy).toHaveBeenCalled()
    window.addEventListener('popstate', () => {
      expect(historyPushstateSpy).toHaveBeenCalled()
      done()
    })
    window.dispatchEvent(new Event('popstate'))
  })
})
