type TrackingState = 'preinit' | 'tracking' | 'stopped'

type AnalyticsOptions = {
  serverUrl?: string
  apiVersion?: 'v1'
  debug?: boolean
  mock?: boolean
  data?: Record<string, string | number>
}

type PageData = {
  fullpath: string
  title: string
  referrer?: string
  meta?: Record<string, string>
}

type Selector = string | 'document' | 'window'

type AnalyticsEvent = {
  event: string
  selectorType: 'id' | 'text' | 'selector'
  selector: Selector
  text?: string
  trigger: string
  page?: string
}

type AnalyticsEvents = AnalyticsEvent[]

type EventKind = 'external' | 'internal' | 'tag-based'

export type {
  TrackingState,
  AnalyticsOptions,
  PageData,
  AnalyticsEvent,
  AnalyticsEvents,
  EventKind,
  Selector,
}
