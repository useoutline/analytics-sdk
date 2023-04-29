import axios, { AxiosInstance } from 'axios'
import { OUTLINE_TRACKING_UID } from './keys'
import state from './state'
import type { AnalyticsEvents, PageData, EventKind } from './types'

let api: AxiosInstance

function createApiInstance(baseURL: string, apiVersion: string) {
  api = axios.create({
    baseURL: new URL(`${apiVersion}/${state.getAnalyticsId()}`, baseURL).href,
  })
}

async function getTrackingUid(): Promise<string> {
  const outlineTrackingUid = localStorage.getItem(OUTLINE_TRACKING_UID)
  if (outlineTrackingUid) {
    return outlineTrackingUid
  } else {
    const { data } = await api.get('/id')
    localStorage.setItem(OUTLINE_TRACKING_UID, data.id)
    return data.id
  }
}

async function getTrackingEvents(): Promise<AnalyticsEvents> {
  const { data } = await api.get('/events')
  return data.events
}

function trackEvent(eventType: EventKind, event: string, page?: PageData) {
  const uid = state.getTrackingUid()
  api.post('/event', {
    uid,
    event,
    type: eventType,
    page,
  })
}

function trackSession(
  page: PageData,
  startTimestamp: string,
  endTimestamp: string
) {
  const uid = state.getTrackingUid()
  api.post('/session', {
    uid,
    page,
    visitedAt: startTimestamp,
    leftAt: endTimestamp,
  })
}

export {
  createApiInstance,
  getTrackingUid,
  getTrackingEvents,
  trackEvent,
  trackSession,
}
