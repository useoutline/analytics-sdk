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

function getBraveHeader() {
  if (window.navigator.brave) {
    return new Headers({
      'X-Browser-Brave': '1',
    })
  } else {
    return new Headers({})
  }
}

async function getTrackingEvents() {
  const res = await fetch(`${api.baseUrl}/events`, { method: 'GET' })
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
  const sessionId = state.value.sessionId
  fetch(`${api.baseUrl}/event`, {
    method: 'POST',
    body: JSON.stringify({
      uid,
      sessionId,
      event,
      type: eventType,
      page,
      data,
      capturedAt: Date.now(),
    }),
    headers: getBraveHeader(),
  })
}

function trackSession(
  page: PageData,
  startTimestamp: number,
  endTimestamp: number
) {
  const uid = state.value.visitorUid
  const sessionId = state.value.sessionId
  fetch(`${api.baseUrl}/session`, {
    method: 'POST',
    body: JSON.stringify({
      uid,
      sessionId,
      page,
      visitedAt: startTimestamp,
      leftAt: endTimestamp,
      capturedAt: Date.now(),
    }),
    headers: getBraveHeader(),
  })
}

export { createApiInstance, getTrackingEvents, trackEvent, trackSession }
