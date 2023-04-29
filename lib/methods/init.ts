import { getTrackingUid, createApiInstance } from '../apis'
import { OUTLINE_API_ENDPOINT } from '../keys'
import logger from '../logger'
import state from '../state'
import type { InitOptions } from '../types'
import { startPageSession } from './pageSession'
import { sendEvent, sendDefaultEvent } from './sendEvent'
import { enableSpaTracking } from './spaTracking'
import { removeEvents, trackEvents } from './trackEvents'

async function init(analyticsId: string, options?: InitOptions) {
  state.setAnalyticsId(analyticsId)
  logger.log('Initialized with id ', analyticsId)

  const apiVersion = options?.apiVersion || 'v1'
  const serverUrl = options?.serverUrl || OUTLINE_API_ENDPOINT
  logger.log('Creating url', apiVersion, serverUrl)
  createApiInstance(serverUrl, apiVersion)
  logger.log('Using API endpoint ', serverUrl, apiVersion)

  if (options?.extendPageData) {
    state.setExtendedPageData(true)
  }

  const trackingUid = await getTrackingUid()
  state.setTrackingUid(trackingUid)

  startTracking()
  startPageSession()

  // const events = await getTrackingEvents()
  // state.setAnalyticsEvents(events)
  logger.log('State', JSON.stringify(state.getState()))

  sendDefaultEvent('internal', 'pageview')

  if (options?.trackDynamicRoutes) {
    enableSpaTracking()
  }

  if (options?.debug) {
    state.setDebug(true)
  }

  return {
    start: startTracking,
    stop: stopTracking,
    sendEvent,
  }
}

function startTracking() {
  state.setTrackingState('tracking')
  logger.log('Tracking started')
  trackEvents()
}

function stopTracking() {
  state.setTrackingState('stopped')
  logger.log('Tracking stopped')
  removeEvents()
}

export { init }
