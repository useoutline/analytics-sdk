import state from '../lib/state'

describe('State', () => {
  test('Set state', () => {
    const visitorUid = 'OAU-test'
    state.setState({ visitorUid })
    expect(state.value.visitorUid).toEqual(visitorUid)
  })
})
