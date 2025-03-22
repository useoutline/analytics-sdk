import { vi, describe, test, expect, afterEach } from 'vitest'
import { startPageSession, endPageSession } from '../../lib/methods/pageSession'
import state from '../../lib/state'

vi.mock('@/apis', () => {
  return {
    trackSession: vi.fn(() => Promise.resolve({ success: true })),
  }
})

describe('Page session', () => {
  state.setState({
    trackingState: 'tracking',
    debug: true,
  })
  test('Start page session', () => {
    const spy = vi.spyOn(console, 'log')
    startPageSession()
    expect(spy).toHaveBeenLastCalledWith(
      '[Outline Logger]',
      'Page session started',
      '"/"',
    )
  })

  test('End page session', () => {
    const spy = vi.spyOn(console, 'log')
    endPageSession()
    expect(spy).toHaveBeenLastCalledWith(
      '[Outline Logger]',
      'Page session ended',
      '"/"',
    )
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })
})
