import { enableSPATracking } from '../../lib/methods/spaTracking'
import state from '../../lib/state'

jest.mock('../../lib/apis', () => {
  return {
    createApiInstance: jest.fn(),
    getVisitorUid: jest.fn(() => Promise.resolve('OAU-test')),
    getTrackingEvents: jest.fn(() => Promise.resolve([])),
    trackEvent: jest.fn(() => Promise.resolve({ success: true })),
    trackSession: jest.fn(() => Promise.resolve({ success: true })),
  }
})

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

describe('SPA Tracking', () => {
  test('Enable SPA tracking', (done) => {
    state.setState({ debug: true })
    const historyPushstateSpy = jest.spyOn(window.history, 'pushState')
    const logSpy = jest.spyOn(console, 'log')
    enableSPATracking()
    history.pushState('/test', 'Test', '/test')
    expect(historyPushstateSpy).toHaveBeenCalled()
    sleep(100).then(() => {
      expect(logSpy).toHaveBeenLastCalledWith(
        '[Outline Logger]',
        'Page session started',
        '"/test"'
      )
      window.addEventListener('popstate', () => {
        sleep(100).then(() => {
          expect(logSpy).toHaveBeenLastCalledWith(
            '[Outline Logger]',
            'Page session started',
            '"/test"'
          )
          done()
        })
      })
      window.dispatchEvent(new Event('popstate'))
    })
  })
})
