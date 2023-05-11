import state from './state'
import type { AnalyticsEvents, PageData, EventKind } from './types'

const OUTLINE_VISITOR_UID = '@useoutline/analytics/uid'

const api: {
  baseUrl: string
} = {
  baseUrl: '',
}

function createApiInstance(baseURL: string, apiVersion: string) {
  api.baseUrl = new URL(
    `${apiVersion}/${state.getState().analyticsId}`,
    baseURL
  ).href
}

function getBraveHeader() {
  if ((window.navigator as any).brave) {
    return new Headers({
      'X-Browser-Brave': '1',
    })
  } else {
    return new Headers({})
  }
}

async function getVisitorUid() {
  let outlineVisitorUid = localStorage.getItem(OUTLINE_VISITOR_UID)
  if (!outlineVisitorUid) {
    const res = await fetch(`${api.baseUrl}/id`, { method: 'GET' })
    const data: { id: string } = await res.json()
    outlineVisitorUid = data.id
    localStorage.setItem(OUTLINE_VISITOR_UID, outlineVisitorUid)
  }
  return outlineVisitorUid
}

async function getTrackingEvents() {
  const res = await fetch(`${api.baseUrl}/events`, { method: 'GET' })
  const data: { events: AnalyticsEvents } = await res.json()
  return data.events
}

function trackEvent(eventType: EventKind, event: string, page?: PageData) {
  const uid = state.getState().visitorUid
  fetch(`${api.baseUrl}/event`, {
    method: 'POST',
    body: JSON.stringify({
      uid,
      event,
      type: eventType,
      page,
    }),
    headers: getBraveHeader(),
  })
}

function trackSession(
  page: PageData,
  startTimestamp: string,
  endTimestamp: string
) {
  const uid = state.getState().visitorUid
  fetch(`${api.baseUrl}/session`, {
    method: 'POST',
    body: JSON.stringify({
      uid,
      page,
      visitedAt: startTimestamp,
      leftAt: endTimestamp,
    }),
    headers: getBraveHeader(),
  })
}

export {
  createApiInstance,
  getVisitorUid,
  getTrackingEvents,
  trackEvent,
  trackSession,
}
