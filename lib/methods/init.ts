import { getVisitorUid, createApiInstance, getTrackingEvents } from '../apis'
import logger from '../logger'
import state from '../state'
import type { InitOptions } from '../types'
import { startPageSession, endPageSession } from './pageSession'
import { sendEvent, sendDefaultEvent } from './sendEvent'
import { enableSPATracking } from './spaTracking'
import { removeEvents, trackEvents } from './trackEvents'
import { getPageData } from './getPageData'

const OUTLINE_API_ENDPOINT = 'https://api.useoutline.xyz'

async function init(analyticsId: string, options?: InitOptions) {
  state.setState({ analyticsId, debug: options?.debug ? true : false })
  logger.log('Initialized with id ', `"${analyticsId}"`)

  const apiVersion = options?.apiVersion || 'v1'
  const serverUrl = options?.serverUrl || OUTLINE_API_ENDPOINT
  createApiInstance(serverUrl, apiVersion)

  const visitorUid = await getVisitorUid()
  const events = await getTrackingEvents()
  state.setState({
    visitorUid,
    analyticsEvents: events,
    extendedPageData: options?.extendPageData ? true : false,
  })

  startTracking()
  startPageSession()
  const page = getPageData()
  window.addEventListener('pagehide', () => {
    page.meta = { ...page.meta, event: 'pagehide' }
    endPageSession(page)
  })

  sendDefaultEvent('internal', 'pageview')
  enableSPATracking()

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
