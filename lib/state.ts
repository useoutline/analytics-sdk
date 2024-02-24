import type { AnalyticsEvents, TrackingState } from '@/types'

type StateKind = {
  trackingState: TrackingState
  analyticsId: string
  visitorUid: string
  analyticsEvents: AnalyticsEvents
  debug: boolean
  mock: boolean
  data?: Record<string, string | number>
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
  },
  setState: (updatedState) => {
    state.value = { ...state.value, ...updatedState }
  },
}

export default state
