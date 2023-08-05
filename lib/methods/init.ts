import { getVisitorUid, createApiInstance, getTrackingEvents } from '@/apis'
import logger from '@/logger'
import state from '@/state'
import type { InitOptions } from '@/types'
import { startPageSession, endPageSession } from '@/methods/pageSession'
import { sendEvent, sendDefaultEvent } from '@/methods/sendEvent'
import { enableSPATracking } from '@/methods/spaTracking'
import { removeEvents, trackEvents } from '@/methods/trackEvents'
import { getPageData } from '@/methods/getPageData'
import { PAGE_SESSION_KEY, OUTLINE_API_ENDPOINT } from '@/constants'

async function init(analyticsId: string, options?: InitOptions) {
  state.setState({
    analyticsId,
    debug: options?.debug,
    mock: options?.mock,
  })
  logger.log('Initialized with id ', `"${analyticsId}"`)

  const apiVersion = options?.apiVersion || 'v1'
  const serverUrl = options?.serverUrl || OUTLINE_API_ENDPOINT
  createApiInstance(serverUrl, apiVersion)

  const visitorUid = await getVisitorUid()
  if (!sessionStorage.getItem(PAGE_SESSION_KEY)) {
    sessionStorage.setItem(PAGE_SESSION_KEY, `OA-${window.crypto.randomUUID()}`)
  }
  state.setState({
    sessionId: sessionStorage.getItem(PAGE_SESSION_KEY) as string,
  })
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
