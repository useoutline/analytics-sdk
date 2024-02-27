import { createApiInstance, getTrackingEvents } from '@/apis'
import logger from '@/logger'
import state from '@/state'
import type { InitOptions } from '@/types'
import { startPageSession, endPageSession } from '@/methods/pageSession'
import { sendEvent, sendDefaultEvent } from '@/methods/sendEvent'
import { enableSPATracking } from '@/methods/spaTracking'
import { trackEvents } from '@/methods/trackEvents'
import { OUTLINE_API_ENDPOINT, OUTLINE_VISITOR_UID_KEY } from '@/constants'
import { getRandomValue } from '@/methods/randomValues'

let isAlreadyInitialized = false

function init(analyticsId: string, options?: InitOptions) {
  if (!isAlreadyInitialized) {
    state.setState({
      analyticsId,
      debug: options?.debug,
      mock: options?.mock,
      data: options?.data,
    })
    logger.log('Initialized with id ', `"${analyticsId}"`)

    const apiVersion = options?.apiVersion || 'v1'
    const serverUrl = options?.serverUrl || OUTLINE_API_ENDPOINT
    createApiInstance(serverUrl, apiVersion)

    const persistedVisitorUid = localStorage.getItem(OUTLINE_VISITOR_UID_KEY)
    const visitorUid = persistedVisitorUid || `OAU-${getRandomValue()}`
    if (!persistedVisitorUid)
      localStorage.setItem(OUTLINE_VISITOR_UID_KEY, visitorUid)
    getTrackingEvents()
      .then((events) => {
        state.setState({ analyticsEvents: events })
        startTracking()
      })
      .catch(() => {
        console.error('Error fetching tracking events')
      })
    state.setState({
      visitorUid,
    })
    startPageSession()
    sendDefaultEvent('internal', 'pageview')
    enableSPATracking()

    window.addEventListener('pagehide', () => {
      logger.log('Page hide event')
      endPageSession({ meta: { event: 'pagehide' } })
    })
    window.addEventListener('pageshow', (event) => {
      logger.log('Page show event')
      if (event.persisted) {
        startTracking()
        startPageSession()
      }
    })
    document.addEventListener('visibilitychange', () => {
      logger.log('Visibility change', document.visibilityState)
      if (document.visibilityState === 'hidden') {
        endPageSession({ meta: { event: 'visibilitychange' } })
      } else {
        startTracking()
        startPageSession()
      }
    })
    isAlreadyInitialized = true
  } else if (options?.data) {
    state.setState({ data: options.data })
  }
  return {
    start: startTracking,
    stop: stopTracking,
    sendEvent,
    setData: (data: Record<string, string | number>) => {
      state.setState({ data })
    },
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
  trackEvents({ remove: true })
}

export { init }
