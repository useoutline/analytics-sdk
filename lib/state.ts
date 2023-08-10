import type { AnalyticsEvents, TrackingState } from '@/types'

type StateKind = {
  trackingState: TrackingState
  analyticsId: string
  visitorUid: string
  analyticsEvents: AnalyticsEvents
  debug: boolean
  mock: boolean
  sessionId: string
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
    analyticsEvents: [],
    debug: false,
    mock: false,
    sessionId: '',
  },
  setState: (updatedState) => {
    state.value = { ...state.value, ...updatedState }
  },
}

export default state
