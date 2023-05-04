import { OUTLINE_TRACKING_UID } from './keys'
import state from './state'
import type { AnalyticsEvents, PageData, EventKind } from './types'

const api: {
  baseUrl: string
} = {
  baseUrl: '',
}

function createApiInstance(baseURL: string, apiVersion: string) {
  api.baseUrl = new URL(`${apiVersion}/${state.getAnalyticsId()}`, baseURL).href
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

async function getTrackingUid() {
  const outlineTrackingUid = localStorage.getItem(OUTLINE_TRACKING_UID)
  if (outlineTrackingUid) {
    return outlineTrackingUid
  } else {
    const res = await fetch(`${api.baseUrl}/id`, { method: 'GET' })
    const data: { id: string } = await res.json()
    localStorage.setItem(OUTLINE_TRACKING_UID, data.id)
    return data.id
  }
}

async function getTrackingEvents() {
  const res = await fetch(`${api.baseUrl}/events`, { method: 'GET' })
  const data: { events: AnalyticsEvents } = await res.json()
  return data.events
}

function trackEvent(eventType: EventKind, event: string, page?: PageData) {
  const uid = state.getTrackingUid()
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
  const uid = state.getTrackingUid()
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
  getTrackingUid,
  getTrackingEvents,
  trackEvent,
  trackSession,
}
