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

  setTrackingState(state: TrackingState) {
    this.state.trackingState = state
  }

  getTrackingState() {
    return this.state.trackingState
  }

  setAnalyticsId(id: string) {
    this.state.analyticsId = id
  }

  getAnalyticsId() {
    return this.state.analyticsId
  }

  setTrackingUid(uid: string) {
    this.state.trackingUid = uid
  }

  getTrackingUid() {
    return this.state.trackingUid
  }

  setExtendedPageData(extendPageData: boolean) {
    this.state.extendedPageData = extendPageData
  }

  getExtendedPageData() {
    return this.state.extendedPageData
  }

  setAnalyticsEvents(events: AnalyticsEvents) {
    this.state.analyticsEvents = events
  }

  getAnalyticsEvents() {
    return this.state.analyticsEvents
  }

  setDebug(debug: boolean) {
    this.state.debug = debug
  }

  getDebug() {
    return this.state.debug
  }

  getState() {
    return this.state
  }
}

const state = new State()

export default state
