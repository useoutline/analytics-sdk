import { trackEvents, removeEvents } from '../../lib/methods/trackEvents'
import state from '../../lib/state'

jest.mock('../../lib/apis', () => {
  return {
    trackEvent: jest.fn(() => Promise.resolve({ success: true })),
    trackSession: jest.fn(() => Promise.resolve({ success: true })),
  }
})

describe('Track events', () => {
  state.setState({
    trackingState: 'tracking',
    analyticsEvents: [
      {
        selectorType: 'selector',
        selector: 'document',
        trigger: 'click',
        event: 'btn-click',
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
    await trackEvents()
    const forEachMock = jest.spyOn(Array.prototype, 'forEach')
    expect(forEachMock).toHaveBeenCalled()
  })

  test('Remove events', async () => {
    await removeEvents()
    const forEachMock = jest.spyOn(Array.prototype, 'forEach')
    expect(forEachMock).toHaveBeenCalled()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })
})
