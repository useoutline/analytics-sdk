type TrackingState = 'preinit' | 'tracking' | 'stopped'

type InitOptions = {
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

type AnalyticsEvents = {
  event: string
  selectorType: 'id' | 'text' | 'selector'
  selector: Selector
  text?: string
  trigger: string
  page?: string
}[]

type EventKind = 'external' | 'internal' | 'tag-based'

export type {
  TrackingState,
  InitOptions,
  PageData,
  AnalyticsEvents,
  EventKind,
  Selector,
}
