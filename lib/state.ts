import type { AnalyticsEvents, TrackingState } from './types'

type StateKind = {
  trackingState: TrackingState
  analyticsId: string
  trackingUid: string
  extendedPageData: boolean
  analyticsEvents: AnalyticsEvents
  debug: boolean
}

class State {
  private state: StateKind

  constructor() {
    this.state = {
      trackingState: 'preinit',
      analyticsId: '',
      trackingUid: '',
      extendedPageData: false,
      analyticsEvents: [],
      debug: false,
    }
  }

  setState(state: StateKind | Partial<StateKind>) {
    this.state = { ...this.state, ...state }
  }

  getState() {
    return this.state
  }
}

const state = new State()

export default state
