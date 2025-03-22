import { describe, test, beforeEach, expect } from 'vitest'
import state from '../lib/state'

describe('State', () => {
  beforeEach(() => {
    // Reset state to initial values before each test
    state.setState({
      trackingState: 'preinit',
      analyticsId: '',
      visitorUid: '',
      analyticsEvents: [],
      debug: false,
      mock: false,
      data: undefined,
    })
  })

  test('Set state', () => {
    const visitorUid = 'OAU-test'
    state.setState({ visitorUid })
    expect(state.value.visitorUid).toEqual(visitorUid)
  })

  test('State updates are immutable', () => {
    // Initial state
    const initialState = { ...state.value }

    // Modify state through setState
    state.setState({ analyticsId: 'test-id' })

    // Verify the update worked
    expect(state.value.analyticsId).toBe('test-id')

    // Try to directly modify the state value (should fail silently)
    try {
      state.value.analyticsId = 'modified-directly'
    } catch (e) {
      // May throw in strict mode
    }

    // Direct modification should have been blocked
    expect(state.value.analyticsId).toBe('test-id')
  })

  test('Multiple updates merge correctly', () => {
    // Set multiple properties in sequence
    state.setState({ analyticsId: 'test-id' })
    state.setState({ debug: true })
    state.setState({ visitorUid: 'visitor-123' })

    // Verify all updates were applied
    expect(state.value.analyticsId).toBe('test-id')
    expect(state.value.debug).toBe(true)
    expect(state.value.visitorUid).toBe('visitor-123')

    // Values not explicitly set should retain their initial values
    expect(state.value.trackingState).toBe('preinit')
  })

  test('Complex nested state updates', () => {
    // Set data with nested values
    state.setState({
      data: {
        userId: '12345',
        pageCount: 5,
        sessionInfo: 'active',
      },
    })

    // Verify nested values
    expect(state.value.data).toEqual({
      userId: '12345',
      pageCount: 5,
      sessionInfo: 'active',
    })

    // Update just part of the data
    state.setState({
      data: {
        ...state.value.data,
        pageCount: 6,
      },
    })

    // Verify the update only changed the specified field
    expect(state.value.data).toEqual({
      userId: '12345',
      pageCount: 6,
      sessionInfo: 'active',
    })
  })
})
