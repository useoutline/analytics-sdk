import state from '@/state'
import type { AnalyticsEvents, PageData, EventKind } from '@/types'

declare global {
  interface Navigator {
    brave?: {
      isBrave: Promise<() => boolean>
    }
  }
}

const api: {
  baseUrl: string
} = {
  baseUrl: '',
}

function createApiInstance(baseURL: string, apiVersion: string) {
  api.baseUrl = new URL(
    `${apiVersion}/${state.value.analyticsId}`,
    baseURL
  ).href
}

const API_TIMEOUT = 5000

function getHeaders() {
  const headers = new Headers({
    'Content-Type': 'application/json',
  })
  if (window.navigator.brave) {
    headers.append('X-Outline-Browser', 'Brave')
  } else if (
    window
      .getComputedStyle(document.documentElement)
      .getPropertyValue('--arc-palette-title')
  ) {
    headers.append('X-Outline-Browser', 'Arc')
  }
  return headers
}

async function getTrackingEvents() {
  const res = await fetch(`${api.baseUrl}/events`, {
    method: 'GET',
    signal: AbortSignal.timeout(API_TIMEOUT),
  })
  const data: { events: AnalyticsEvents } = await res.json()
  return data.events
}

function trackEvent(
  eventType: EventKind,
  event: string,
  page?: PageData,
  data?: Record<string, string | number>
) {
  const uid = state.value.visitorUid
  fetch(`${api.baseUrl}/event`, {
    method: 'POST',
    body: JSON.stringify({
      uid,
      event,
      type: eventType,
      page,
      data,
      capturedAt: Date.now(),
    }),
    headers: getHeaders(),
  })
}

function trackSession(
  page: PageData,
  startTimestamp: number,
  endTimestamp: number
) {
  const uid = state.value.visitorUid
  fetch(`${api.baseUrl}/session`, {
    method: 'POST',
    body: JSON.stringify({
      uid,
      page,
      visitedAt: startTimestamp,
      leftAt: endTimestamp,
      capturedAt: Date.now(),
      data: state.value.data,
    }),
    headers: getHeaders(),
  })
}

export { createApiInstance, getTrackingEvents, trackEvent, trackSession }
