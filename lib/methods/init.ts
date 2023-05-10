import { getTrackingUid, createApiInstance, getTrackingEvents } from '../apis'
import { OUTLINE_API_ENDPOINT } from '../keys'
import logger from '../logger'
import state from '../state'
import type { InitOptions } from '../types'
import { startPageSession, endPageSession } from './pageSession'
import { sendEvent, sendDefaultEvent } from './sendEvent'
import { enableSpaTracking } from './spaTracking'
import { removeEvents, trackEvents } from './trackEvents'
import { getPageData } from './getPageData'

async function init(analyticsId: string, options?: InitOptions) {
  if (options?.debug) {
    state.setState({ debug: true })
  }

  state.setState({ analyticsId })
  logger.log('Initialized with id ', analyticsId)

  const apiVersion = options?.apiVersion || 'v1'
  const serverUrl = options?.serverUrl || OUTLINE_API_ENDPOINT
  createApiInstance(serverUrl, apiVersion)
  logger.log('Using API endpoint ', serverUrl, apiVersion)

  if (options?.extendPageData) {
    state.setState({ extendedPageData: true })
  }

  const trackingUid = await getTrackingUid()
  state.setState({ trackingUid })

  const events = await getTrackingEvents()
  state.setState({ analyticsEvents: events })

  startTracking()
  startPageSession()
  const page = getPageData()
  window.addEventListener('pagehide', () => {
    page.meta = { event: 'pagehide' }
    endPageSession(page)
  })

  sendDefaultEvent('internal', 'pageview')

  if (options?.trackDynamicRoutes) {
    enableSpaTracking()
  }

  return {
    start: startTracking,
    stop: stopTracking,
    sendEvent,
  }
}

function startTracking() {
  state.setState({ trackingState: 'tracking' })
  logger.log('Tracking started')
  trackEvents()
}

function stopTracking() {
  state.setState({ trackingState: 'stopped' })
  logger.log('Tracking stopped')
  removeEvents()
}

export { init }
