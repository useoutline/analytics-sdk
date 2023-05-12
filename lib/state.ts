import type { AnalyticsEvents, TrackingState } from './types'

type StateKind = {
  trackingState: TrackingState
  analyticsId: string
  visitorUid: string
  extendedPageData: boolean
  analyticsEvents: AnalyticsEvents
  debug: boolean
}

type ReactiveState = {
  value: StateKind
  setState: (updatedState: Partial<StateKind>) => void
}

const state: ReactiveState = {
  value: {
    trackingState: 'preinit',
    analyticsId: '',
    visitorUid: '',
    extendedPageData: false,
    analyticsEvents: [],
    debug: false,
  },
  setState: (updatedState) => {
    state.value = { ...state.value, ...updatedState }
  },
}

export default state
