import { trackEvents } from '../../lib/methods/trackEvents'
import state from '../../lib/state'

jest.mock('@/apis', () => {
  return {
    trackEvent: jest.fn(() => Promise.resolve({ success: true })),
    trackSession: jest.fn(() => Promise.resolve({ success: true })),
  }
})
const realLocation = window.location

describe('Track events', () => {
  state.setState({
    trackingState: 'tracking',
    analyticsEvents: [
      {
        selectorType: 'selector',
        selector: 'document',
        trigger: 'click',
        event: 'btn-click',
        page: '/:id/:name/userprofile',
      },
      {
        selectorType: 'selector',
        selector: 'window',
        trigger: 'click',
        event: 'btn-click',
        page: '/:id/:name/user',
      },
      {
        selectorType: 'selector',
        selector: 'window',
        trigger: 'click',
        event: 'btn-click',
      },
      {
        selectorType: 'text',
        text: 'test',
        selector: 'button',
        trigger: 'click',
        event: 'btn-click',
      },
      {
        selectorType: 'id',
        selector: 'button',
        trigger: 'click',
        event: 'btn-click',
      },
      {
        selectorType: 'selector',
        selector: 'button',
        trigger: 'click',
        event: 'btn-click',
      },
    ],
  })
  test('Track events', async () => {
    // @ts-ignore
    delete window.location
    // @ts-ignore
    window.location = new URL('http://google.com/:id/:name/userprofile')
    await trackEvents()
    const forEachMock = jest.spyOn(Array.prototype, 'forEach')
    expect(forEachMock).toHaveBeenCalled()
    window.dispatchEvent(new CustomEvent('click'))
  })

  test('Remove events', async () => {
    await trackEvents({ remove: true })
    const forEachMock = jest.spyOn(Array.prototype, 'forEach')
    expect(forEachMock).toHaveBeenCalled()
  })

  afterEach(() => {
    window.location = realLocation
    jest.restoreAllMocks()
  })
})
